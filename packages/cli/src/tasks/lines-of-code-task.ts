import { extname } from 'path';
import {
  BaseTask,
  Task,
  TaskMetaData,
  TaskResult,
  buildLookupValueResult,
  TaskContext,
} from '@checkup/core';

import LinesOfCodeTaskResult from '../results/lines-of-code-task-result';

const fs = require('fs');
const sloc = require('sloc');

/*
 * note: these extensions must be supported here https://github.com/flosse/sloc/blob/731fbea00799a45a6068c4aaa1d6b7f67500615e/src/sloc.coffee#L264
 * for the analysis on comments/empty lines/etc to be correct
 */
const FILE_EXTENSIONS_SUPPORTED = new Set(sloc.extensions);

export default class LinesOfCodeTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'lines-of-code',
    friendlyTaskName: 'Lines of Code',
    taskClassification: {
      category: 'metrics', // TODO: change this to a meta task
    },
  };

  async run(): Promise<TaskResult> {
    let linesOfCode = await getLinesOfCode(this.context);

    let lookupValueResult = buildLookupValueResult(
      'lines of code',
      linesOfCode,
      'extension',
      'lines'
    );

    let result = new LinesOfCodeTaskResult(this.meta, this.config);

    result.process([lookupValueResult]);

    return result;
  }
}

async function getLinesOfCode(context: TaskContext) {
  let fileInfos: Array<{
    filePath: string;
    extension: string;
    lines: number;
  }> = [];

  await Promise.all(
    context.paths
      .filter((filePath) => {
        let extension = getExtension(filePath);

        return FILE_EXTENSIONS_SUPPORTED.has(extension);
      })
      .map((filePath) => {
        return fs.promises.readFile(filePath, 'utf8').then((contents: string) => {
          let extension = getExtension(filePath);
          let { total } = sloc(contents, extension);

          fileInfos.push({
            filePath: filePath.replace(context.cliFlags.cwd, ''),
            extension,
            lines: total,
          });
        });
      })
  );

  return fileInfos;
}

function getExtension(filePath: string) {
  return extname(filePath).replace('.', '');
}
