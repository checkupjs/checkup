import { SearchPatterns, Task, TaskResult } from './types';

import FileSearcher from './searchers/file-searcher';

/**
 * @class FileSearcherTask
 * @extends Task
 * @implements ITask
 *
 * A checkup task specific to file searcher used to encapsulate an operation that
 * checks certain characteristics of your Ember project.
 */
export default abstract class FileSearcherTask implements Task {
  searcher: FileSearcher;

  /**
   *
   * @param result {TaskResult[]} the result object that aggregates data together for output.
   * @param searchPatterns {SearchPatterns} the search pattern that your filesearcher uses to return the results.
   */
  constructor(searchPatterns: SearchPatterns) {
    this.searcher = new FileSearcher(process.cwd(), searchPatterns);
  }

  abstract run(): Promise<TaskResult>;
}
