import * as globby from 'globby';
import { SearchPatterns, ITaskItemData } from '../types';

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
  async search(): Promise<ITaskItemData> {
    const resultData: ITaskItemData = {};

    for (const pattern in this.searchPatterns) {
      if (Object.prototype.hasOwnProperty.call(this.searchPatterns, pattern)) {
        resultData[pattern] = await this._getSearchItem(pattern);
      }
    }
    return resultData;
  }

  _getSearchItem(pattern: string): Promise<string[]> {
    let patterns = this.searchPatterns[pattern].concat(IGNORE_PATTERNS);
    return globby(patterns, { cwd: this.baseDir });
  }
}
