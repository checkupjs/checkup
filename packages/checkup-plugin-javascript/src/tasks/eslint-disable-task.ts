import { TaskResult, Task, TaskMetaData, BaseTask, TaskItemData } from '@checkup/core';
import EslintDisableTaskResult from '../results/eslint-disable-task-result';

const fs = require('fs');
const recast = require('recast');
const babel = require('@babel/parser');

const ESLINT_DISABLE_REGEX = /^eslint-disable(?:-next-line|-line)*/gi;

export default class EslintDisableTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'eslint-disables',
    friendlyTaskName: 'Number of eslint-disable Usages',
    taskClassification: {
      category: 'linting',
    },
  };

  async run(): Promise<TaskResult> {
    let jsPaths = this.context.paths.filterByGlob('**/*.js');
    let eslintDisables = await getEslintDisables(jsPaths);

    return new EslintDisableTaskResult(this.meta, this.config, eslintDisables);
  }
}

async function getEslintDisables(filePaths: string[]) {
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

          let ast = recast.parse(fileString, {
            parser: {
              parse: babel.parse,
            },
          });
          recast.visit(ast, {
            visitComment: function (path: any) {
              numMatches += (path.value.value.trim().match(ESLINT_DISABLE_REGEX) || []).length;

              this.traverse(path);
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
