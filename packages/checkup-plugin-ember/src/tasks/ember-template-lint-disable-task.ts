import {
  Task,
  BaseTask,
  LintResult,
  buildResultFromLintResult,
  normalizePath,
  AstTraverser,
} from '@checkup/core';
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
    let templateLintDisables = await getTemplateLintDisables(hbsPaths, this.context.cliFlags.cwd);

    return [this.toJson(buildResultFromLintResult(templateLintDisables))];
  }
}

async function getTemplateLintDisables(filePaths: string[], cwd: string) {
  let data: LintResult[] = [];

  class TemplateLintDisableAccumulator {
    data: LintResult[] = [];

    constructor(private filePath: string) {}

    get visitors() {
      let add = (node: any) => {
        this.data.push({
          filePath: normalizePath(this.filePath, cwd),
          lintRuleId: 'no-ember-template-lint-disable',
          message: 'ember-template-lint-disable usages',
          line: node.loc.start.line,
          column: node.loc.start.column,
        });
      };

      return {
        MustacheCommentStatement(node: any) {
          if (node.value.toLowerCase().includes(TEMPLATE_LINT_DISABLE)) {
            add(node);
          }
        },
        CommentStatement(node: any) {
          if (node.value.toLowerCase().includes(TEMPLATE_LINT_DISABLE)) {
            add(node);
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
