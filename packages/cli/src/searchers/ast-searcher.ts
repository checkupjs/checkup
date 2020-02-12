import * as path from 'path';
import * as globby from 'globby';
import { ISearchTraverser } from '../types';

const IGNORE_PATTERNS: string[] = [
  '!**/node_modules/**',
  '!bower_components/**',
  '!**/tests/dummy/**',
  '!concat-stats-for/**',
  '!dist',
  '!build',
];

export default class AstSearcher {
  rootSearchPath: string;
  globPatterns: Array<string>;

  /**
   * @param rootSearchPath The root path in which the searcher will begin the search.
   * @param globPatterns The array of file search patterns
   */
  constructor(rootSearchPath: string, globPatterns: Array<string> = ['**/*.js']) {
    this.rootSearchPath = rootSearchPath;
    this.globPatterns = globPatterns;
  }

  /**
   * Will perform a search against files identified by the classes provided glob pattern.
   * Utilizes the supplied ISearchTraverser to operate against each file.
   *
   * @param searchTraverser {ISearchTraverser} The provided traverser to operate against each file in the class' glob pattern.
   */
  async search<T>(searchTraverser: ISearchTraverser<T>): Promise<Map<string, T>> {
    let searchResultMap = new Map<string, T>();
    let paths = await globby(this.globPatterns.concat(IGNORE_PATTERNS), {
      cwd: this.rootSearchPath,
    });

    paths.forEach(filePath => {
      let fullFilePath: string = path.join(this.rootSearchPath, filePath);

      searchTraverser.traverseAst(fullFilePath);

      if (searchTraverser.hasResults) {
        let nodes: T = searchTraverser.results;

        searchResultMap.set(fullFilePath, nodes);

        searchTraverser.reset();
      }
    });

    return searchResultMap;
  }
}
