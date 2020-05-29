import { BaseTaskResult, TaskResult, ui, TaskMetaData } from '@checkup/core';
import {
  FileResults,
  SupportedResults,
  FileStats,
  ConditionallySupportedResults,
} from '../tasks/lines-of-code-task';

const sloc = require('sloc');

/*
 * note: these extensions must be supported here https://github.com/flosse/sloc/blob/731fbea00799a45a6068c4aaa1d6b7f67500615e/src/sloc.coffee#L264
 * for the analysis on comments/empty lines/etc to be correct
 */
const FILE_EXTENSIONS_SUPPORTED = sloc.extensions;

export default class LinesOfCodeTaskResult extends BaseTaskResult implements TaskResult {
  fileResults: FileResults[];

  constructor(meta: TaskMetaData, fileResults: FileResults[]) {
    super(meta);

    this.fileResults = transformResults(fileResults);
  }

  toConsole() {
    let flattenedResults = this.fileResults.map((result) => {
      return { ...result.results, ...result };
    });

    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(flattenedResults, {
        fileExension: { header: 'File type', minWidth: 12 },
        total: { header: 'Total', minWidth: 12 },
        todo: { header: 'TODO' },
      });
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: { fileResults: this.fileResults },
    };
  }
}

function transformResults(fileResults: FileResults[]) {
  return fileResults.map((fileResult) => {
    let reducedResults = fileResult.results.reduce(
      (acc: any, result: FileStats) => {
        Object.values(SupportedResults).forEach((resultType) => {
          acc[resultType] += result[resultType];
        });

        Object.values(ConditionallySupportedResults).forEach((resultType) => {
          acc[resultType] = FILE_EXTENSIONS_SUPPORTED.includes(fileResult.fileExension)
            ? acc[resultType] + result[resultType]
            : 'N/A';
        });
        return acc;
      },
      {
        total: 0,
        todo: 0,
        block: 0,
        blockEmpty: 0,
        comment: 0,
        empty: 0,
        mixed: 0,
        single: 0,
        source: 0,
      }
    );

    return {
      results: reducedResults,
      fileExension: fileResult.fileExension,
      errors: fileResult.errors,
    };
  });
}
