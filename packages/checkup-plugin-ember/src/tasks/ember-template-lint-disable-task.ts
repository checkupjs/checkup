import { Task, BaseTask, LintResult, trimCwd, AstTraverser, sarifBuilder } from '@checkup/core';
import { Result } from 'sarif';

const fs = require('fs');
const { parse, traverse } = require('ember-template-recast');

const TEMPLATE_LINT_DISABLE = 'template-lint-disable';

export default class EmberTemplateLintDisableTask extends BaseTask implements Task {
  taskName = 'ember-template-lint-disables';
  taskDisplayName = 'Number of template-lint-disable Usages';
  category = 'linting';
  group = 'disabled-lint-rules';

  async run(): Promise<Result[]> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');
    let templateLintDisables = await getTemplateLintDisables(hbsPaths, this.context.options.cwd);

    return sarifBuilder.fromLintResults(this, templateLintDisables);
  }
}

async function getTemplateLintDisables(filePaths: string[], cwd: string) {
  let data: LintResult[] = [];

  class TemplateLintDisableAccumulator {
    data: LintResult[] = [];

    constructor(private filePath: string) {}

    add(node: any) {
      this.data.push({
        filePath: trimCwd(this.filePath, cwd),
        lintRuleId: 'no-ember-template-lint-disable',
        message: 'ember-template-lint-disable usages',
        line: node.loc.start.line,
        column: node.loc.start.column,
      });
    }

    get visitors() {
      let self = this;

      return {
        MustacheCommentStatement(node: any) {
          if (node.value.toLowerCase().includes(TEMPLATE_LINT_DISABLE)) {
            self.add(node);
          }
        },
        CommentStatement(node: any) {
          if (node.value.toLowerCase().includes(TEMPLATE_LINT_DISABLE)) {
            self.add(node);
          }
        },
      };
    }
  }

  await Promise.all(
    filePaths.map((filePath) => {
      return fs.promises.readFile(filePath, 'utf8').then((fileContents: string) => {
        let accumulator = new TemplateLintDisableAccumulator(filePath);
        let astTraverser = new AstTraverser(fileContents, parse, traverse);

        astTraverser.traverse(accumulator.visitors);
        data.push(...accumulator.data);
      });
    })
  );
  return data;
}
