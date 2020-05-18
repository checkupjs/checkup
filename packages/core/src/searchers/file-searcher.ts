import * as globby from 'globby';

import { SearchPatterns, TaskItemData } from '../types/tasks';
import { toTaskItemData } from '../utils/data-transformers';

const fs = require('fs');
const walkSync = require('walk-sync');
const path = require('path');
const PATHS_TO_IGNORE = [
  '**/node_modules/**',
  'bower_components/**',
  '**/tests/dummy/**',
  'concat-stats-for/**',
  'dist',
  'build',
  'vendor',
  '.git',
];
interface StringsFound {
  counts: Record<string, number>;
  errors: string[];
}

/**
 * @class FileSearcher
 *
 * Provides static file searching capabilities.
 */
export default class FileSearcher {
  baseDirectory: string;
  searchPatterns: SearchPatterns;

  /**
   *
   * @param baseDirectory {String} the top level directory to start searching
   * @param searchPatterns {SearchPatterns} the collection of patterns to search for. A pattern is
   *                                        in the form of `{ [key: string]: string[] }`
   */
  constructor(baseDirectory: string, searchPatterns: SearchPatterns) {
    this.baseDirectory = baseDirectory;
    this.searchPatterns = searchPatterns;
  }

  /**
   * Invokes the search, for each search pattern.
   */
  async findFiles(): Promise<TaskItemData[]> {
    const resultData = [];

    for (const searchPatternName in this.searchPatterns) {
      if (Object.prototype.hasOwnProperty.call(this.searchPatterns, searchPatternName)) {
        let data = await this._getFileSearchItem(searchPatternName);
        resultData.push(toTaskItemData(searchPatternName, data));
      }
    }
    return resultData;
  }

  _getFileSearchItem(searchPatternName: string): Promise<string[]> {
    let patterns = this.searchPatterns[searchPatternName].concat(
      PATHS_TO_IGNORE.map((path) => `!${path}`)
    );
    return globby(patterns, { cwd: this.baseDirectory });
  }

  async findStrings(filesToSearch?: string[]): Promise<StringsFound> {
    const files: string[] =
      filesToSearch ||
      walkSync(this.baseDirectory, {
        ignore: PATHS_TO_IGNORE,
        directories: false,
      });

    let stringResults: StringsFound = {
      counts: Object.keys(this.searchPatterns).reduce(
        (a: Record<string, number>, b) => ((a[b] = 0), a),
        {}
      ),
      errors: [],
    };

    await Promise.all(
      files.map((file) => {
        return fs.promises
          .readFile(path.join(path.resolve(this.baseDirectory), file), 'utf8')
          .then((fileString: string) => {
            for (let searchPatternName in this.searchPatterns) {
              stringResults.counts[searchPatternName] += this._getStringSearchCount(
                fileString,
                this.searchPatterns[searchPatternName]
              );
            }
          })
          .catch((error: string) => {
            stringResults.errors.push(error);
          });
      })
    );
    return stringResults;
  }

  _getStringSearchCount(str: string, patternsToSearch: string[]) {
    let count = 0;
    patternsToSearch.forEach((pattern) => {
      count += (str.match(new RegExp(pattern, 'g')) || []).length;
    });
    return count;
  }
}
