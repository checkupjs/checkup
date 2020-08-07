import {
  Task,
  TaskMetaData,
  BaseTask,
  LintResult,
  buildSummaryResult,
  normalizePath,
  AstTraverser,
  TaskResult,
} from '@checkup/core';

const fs = require('fs');
const { parse, traverse } = require('ember-template-recast');

const TEMPLATE_LINT_DISABLE = 'template-lint-disable';

export default class EmberTemplateLintDisableTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'ember-template-lint-disables',
    friendlyTaskName: 'Number of template-lint-disable Usages',
    taskClassification: {
      category: 'linting',
      group: 'ember',
    },
  };

  async run(): Promise<TaskResult> {
    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');
    let templateLintDisables = await getTemplateLintDisables(hbsPaths, this.context.cliFlags.cwd);

    return this.toJson([buildSummaryResult('ember-template-lint-disable', templateLintDisables)]);
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
          ruleId: 'no-ember-template-lint-disable',
          message: 'ember-template-lint-disable is not allowed',
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
