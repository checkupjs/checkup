import { ITask, ITaskResult } from './types';

/**
 * @class Task
 * @implements ITask
 *
 * An checkup task used to encapsulate an operation that
 * checks certain characteristics of your Ember project.
 */
export default abstract class Task implements ITask {
  abstract run(): Promise<ITaskResult>;
}
