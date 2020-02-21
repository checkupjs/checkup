import BaseTask from './base-task';
import FileSearcher from './searchers/file-searcher';
import { SearchPatterns } from './types';

/**
 * @class FileSearcherTask
 * @extends Task
 * @implements ITask
 *
 * A checkup task specific to file searcher used to encapsulate an operation that
 * checks certain characteristics of your Ember project.
 */
export default abstract class FileSearcherTask extends BaseTask {
  searcher: FileSearcher;

  /**
   *
   * @param result {TaskResult[]} the result object that aggregates data together for output.
   * @param searchPatterns {SearchPatterns} the search pattern that your filesearcher uses to return the results.
   */
  constructor(args: any, searchPatterns: SearchPatterns) {
    super(args);

    this.searcher = new FileSearcher(args.path, searchPatterns);
  }
}
