import { BaseTask, Task, TaskContext, TaskMetaData, TaskResult } from '@checkup/core';

import LinesOfCodeTaskResult from '../results/lines-of-code-task-result';

const fs = require('fs');
const sloc = require('sloc');

interface GroupedFiles {
  paths: string[];
  ext: string;
  exensionSupportedBySloc: boolean;
}

export enum ConditionallySupportedResults {
  Block = 'block',
  BlockEmpty = 'blockEmpty',
  Comment = 'comment',
  Empty = 'empty',
  Mixed = 'mixed',
  Single = 'single',
  Source = 'source',
  Todo = 'todo',
}

export enum SupportedResults {
  Total = 'total',
}

export type FileStats = {
  [key in ConditionallySupportedResults | SupportedResults]: number;
};

export interface FileResults {
  errors: string[];
  results: FileStats[];
  fileExension: string;
  exensionSupportedBySloc?: boolean;
}

/*
 * note: these extensions must be supported here https://github.com/flosse/sloc/blob/731fbea00799a45a6068c4aaa1d6b7f67500615e/src/sloc.coffee#L264
 * for the analysis on comments/empty lines/etc to be correct
 */
const FILE_EXTENSIONS_SUPPORTED_BY_SLOC = new Set(sloc.extensions);
const FILE_EXTENSIONS_NOT_SUPPORTED_BY_SLOC = new Set(['md', 'json']);

export default class LinesOfCodeTask extends BaseTask implements Task {
  filesGroupedByType: GroupedFiles[];

  meta: TaskMetaData = {
    taskName: 'lines-of-code',
    friendlyTaskName: 'Lines of Code',
    taskClassification: {
      category: 'metrics', // TODO: change this to a meta task
    },
  };

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    // get all file exensions in the repo to group the files
    const fileExensionsInRepo = new Set<string>();

    this.context.paths.forEach((path) => {
      fileExensionsInRepo.add(path.split('.')[1]);
    });

    const fileExtensionsToLookFor = [...fileExensionsInRepo].filter(
      (ext) =>
        FILE_EXTENSIONS_NOT_SUPPORTED_BY_SLOC.has(ext) || FILE_EXTENSIONS_SUPPORTED_BY_SLOC.has(ext)
    );

    this.filesGroupedByType = fileExtensionsToLookFor.map((ext) => {
      return {
        ext,
        paths: this.context.paths.filterByGlob(`**/*.${ext}`),
        // if sloc doesnt support the extension, the LOC will be correct, but the breakdowns (# comments, todos, etc) will be wrong
        exensionSupportedBySloc: FILE_EXTENSIONS_SUPPORTED_BY_SLOC.has(ext),
      };
    });
  }

  async run(): Promise<TaskResult> {
    let linesOfCode: FileResults[] = await Promise.all(
      this.filesGroupedByType.map((group) => {
        return getLinesOfCode(group);
      })
    );

    let result = new LinesOfCodeTaskResult(this.meta, this.config);

    result.process({ linesOfCode });

    return result;
  }
}

async function getLinesOfCode(filePaths: GroupedFiles): Promise<FileResults> {
  let fileResults = {
    errors: [] as string[],
    results: [] as FileStats[],
    fileExension: filePaths.ext,
    exensionSupportedBySloc: filePaths.exensionSupportedBySloc,
  };

  await Promise.all(
    filePaths.paths.map((file) => {
      return fs.promises
        .readFile(file, 'utf8')
        .then((fileString: string) => {
          let exensionToProvideToSloc = filePaths.exensionSupportedBySloc ? filePaths.ext : 'js';
          let slocResults: FileStats = sloc(fileString, exensionToProvideToSloc);

          fileResults.results.push(slocResults);
        })
        .catch((error: string) => {
          fileResults.errors.push(error);
        });
    })
  );
  return fileResults;
}
