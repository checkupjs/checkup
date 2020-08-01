import {
  TaskResult,
  Task,
  TaskMetaData,
  BaseTask,
  LintResultData,
  buildSummaryResult,
  normalizePath,
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
  let addDisable = (filePath: string, node: any) => {
    data.push({
      filePath: normalizePath(filePath, cwd),
      ruleId: 'no-ember-template-lint-disable',
      message: 'ember-template-lint-disable is not allowed',
      line: node.loc.start.line,
      column: node.loc.start.column,
    });
  };

  await Promise.all(
    filePaths.map((filePath) => {
      return fs.promises.readFile(filePath, 'utf8').then((fileString: string) => {
        let ast = parse(fileString);

        traverse(ast, {
          MustacheCommentStatement(node: any) {
            if (node.value.toLowerCase().includes(TEMPLATE_LINT_DISABLE)) {
              addDisable(filePath, node);
            }
          },
          CommentStatement(node: any) {
            if (node.value.toLowerCase().includes(TEMPLATE_LINT_DISABLE)) {
              addDisable(filePath, node);
            }
          },
        });
      });
    })
  );
  return data;
}
