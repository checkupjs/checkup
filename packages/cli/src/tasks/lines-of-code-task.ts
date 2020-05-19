import {
  TaskResult,
  Task,
  Category,
  Priority,
  TaskMetaData,
  BaseTask,
  TaskContext,
} from '@checkup/core';
import LinesOfCodeTaskResult from '../results/lines-of-code-task-result';

const fs = require('fs');
const sloc = require('sloc');
const micromatch = require('micromatch');

/*
 * note: these extensions must be supported here https://github.com/flosse/sloc/blob/731fbea00799a45a6068c4aaa1d6b7f67500615e/src/sloc.coffee#L264
 * for the analysis on comments/empty lines/etc to be correct
 */
const FILE_EXTENSIONS_SUPPORTED = ['js', 'hbs', 'scss', 'css', 'json', 'md'];

interface GroupedFiles {
  paths: string[];
  ext: string;
}

interface FileStats {
  block: number;
  blockEmpty: number;
  comment: number;
  empty: number;
  mixed: number;
  single: number;
  source: number;
  todo: number;
  total: number;
}

export interface FileResults {
  errors: string[];
  results: FileStats[];
  fileExension: string;
}

export default class LinesOfCodeTask extends BaseTask implements Task {
  filesGroupedByType: GroupedFiles[];

  meta: TaskMetaData = {
    taskName: 'lines-of-code',
    friendlyTaskName: 'Lines of Code',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.Low,
    },
  };

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.filesGroupedByType = FILE_EXTENSIONS_SUPPORTED.map((ext) => {
      return {
        ext,
        paths: micromatch(this.context.paths, `**/*.${ext}`),
      };
    });
  }

  async run(): Promise<TaskResult> {
    let linesOfCode: FileResults[] = await Promise.all(
      this.filesGroupedByType.map((group) => {
        return getLinesOfCode(group);
      })
    );

    // remove all file types that have no results
    let filteredLinesOfCode: FileResults[] = linesOfCode.filter((loc) => {
      return loc.results.length > 0;
    });

    let result: LinesOfCodeTaskResult = new LinesOfCodeTaskResult(this.meta);
    result.fileResults = filteredLinesOfCode;

    return result;
  }
}

async function getLinesOfCode(filePaths: GroupedFiles): Promise<FileResults> {
  let fileResults = {
    errors: [] as string[],
    results: [] as FileStats[],
    fileExension: filePaths.ext,
  };

  await Promise.all(
    filePaths.paths.map((file) => {
      return fs.promises
        .readFile(file, 'utf8')
        .then((fileString: string) => {
          fileResults.results.push(sloc(fileString, 'js'));
        })
        .catch((error: string) => {
          fileResults.errors.push(error);
        });
    })
  );
  return fileResults;
}
