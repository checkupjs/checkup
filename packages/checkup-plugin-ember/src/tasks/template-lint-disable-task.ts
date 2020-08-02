import {
  TaskResult,
  Task,
  TaskMetaData,
  BaseTask,
  LintResultData,
  buildSummaryResult,
  normalizePath,
  AstTraverser,
} from '@checkup/core';
import TemplateLintDisableTaskResult from '../results/template-lint-disable-task-result';

const fs = require('fs');
const { parse, traverse } = require('ember-template-recast');

const TEMPLATE_LINT_DISABLE = 'template-lint-disable';

export default class TemplateLintDisableTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'template-lint-disables',
    friendlyTaskName: 'Number of template-lint-disable Usages',
    taskClassification: {
      category: 'linting',
      group: 'ember',
    },
  };

  async run(): Promise<TaskResult> {
    let result: TemplateLintDisableTaskResult = new TemplateLintDisableTaskResult(
      this.meta,
      this.config
    );

    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');
    let templateLintDisables = await getTemplateLintDisables(hbsPaths, this.context.cliFlags.cwd);

    result.process([buildSummaryResult('ember-template-lint-disable', templateLintDisables)]);

    return result;
  }
}

async function getTemplateLintDisables(filePaths: string[], cwd: string) {
  let data: LintResultData[] = [];

  class TemplateLintDisableAccumulator {
    data: LintResultData[] = [];

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
