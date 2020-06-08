import { TaskResult, Task, TaskType, TaskMetaData, BaseTask, TaskItemData } from '@checkup/core';
import TemplateLintDisableTaskResult from '../results/template-lint-disable-task-result';

const fs = require('fs');
const { parse, traverse } = require('ember-template-recast');

const TEMPLATE_LINT_DISABLE_REGEX = /^template-lint-disable*/gi;

export default class TemplateLintDisableTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'template-lint-disables',
    friendlyTaskName: 'Number of template-lint-disable Usages',
    taskClassification: {
      type: TaskType.Insights,
      category: 'linting',
    },
  };

  async run(): Promise<TaskResult> {
    let result: TemplateLintDisableTaskResult = new TemplateLintDisableTaskResult(this.meta);

    let hbsPaths = this.context.paths.filterByGlob('**/*.hbs');
    result.templateLintDisables = await getTemplateLintDisables(hbsPaths);

    return result;
  }
}

async function getTemplateLintDisables(filePaths: string[]) {
  let fileResults = {
    errors: [] as string[],
    results: [] as TaskItemData[],
  };

  await Promise.all(
    filePaths.map((file) => {
      return fs.promises
        .readFile(file, 'utf8')
        .then((fileString: string) => {
          let numMatches = 0;

          let ast = parse(fileString);

          traverse(ast, {
            MustacheCommentStatement(node: any) {
              numMatches += (node.value.trim().match(TEMPLATE_LINT_DISABLE_REGEX) || []).length;
            },
            CommentStatement(node: any) {
              numMatches += (node.value.trim().match(TEMPLATE_LINT_DISABLE_REGEX) || []).length;
            },
          });
          if (numMatches) {
            fileResults.results.push(...new Array(numMatches).fill({ data: file }));
          }
        })
        .catch((error: string) => {
          fileResults.errors.push(error);
        });
    })
  );
  return fileResults;
}
