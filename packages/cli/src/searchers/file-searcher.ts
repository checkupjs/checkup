import * as globby from 'globby';

import { SearchPatterns, TaskItemData } from '../types';

const IGNORE_PATTERNS: string[] = [
  '!**/node_modules/**',
  '!bower_components/**',
  '!**/tests/dummy/**',
  '!concat-stats-for/**',
  '!dist',
  '!build',
];

/**
 * @class FileSearcher
 *
 * Provides static file searching capabilities.
 */
export default class FileSearcher {
  baseDir: string;
  searchPatterns: SearchPatterns;
  searchPromises: Promise<string[]>[];

  /**
   *
   * @param baseDir {String} the top level directory to start searching
   * @param searchPatterns {SearchPatterns} the collection of patterns to search for. A pattern is
   *                                        in the form of `{ [key: string]: string[] }`
   */
  constructor(baseDir: string, searchPatterns: SearchPatterns) {
    this.baseDir = baseDir;
    this.searchPatterns = searchPatterns;
    this.searchPromises = [];
  }

  /**
   * Invokes the search, for each search pattern.
   */
  async search(): Promise<TaskItemData[]> {
    const resultData = [];

    for (const searchPatternName in this.searchPatterns) {
      if (Object.prototype.hasOwnProperty.call(this.searchPatterns, searchPatternName)) {
        let data = await this._getSearchItem(searchPatternName);
        resultData.push({ type: searchPatternName, data, total: data.length });
      }
    }
    return resultData;
  }

  _getSearchItem(searchPatternName: string): Promise<string[]> {
    let patterns = this.searchPatterns[searchPatternName].concat(IGNORE_PATTERNS);
    return globby(patterns, { cwd: this.baseDir });
  }
}
