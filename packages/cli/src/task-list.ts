import * as pMap from 'p-map';

import { ITask, ITaskConstructor, ITaskList, ITaskResult } from './types';

/**
 * @class TaskList
 *
 * Represents a collection of tasks to run.
 */
export default class TaskList implements ITaskList {
  private defaultTasks: ITask[];

  /**
   *
   * @param results {ITaskResult[]} the results object that aggregates data together for output.
   */
  constructor() {
    this.defaultTasks = [];
  }

  /**
   * @method addDefault
   *
   * Adds a default task to the task list, which is executed as part of checkup.
   *
   * @param taskConstructor {ITaskConstructor} a constructor representing a Task class
   */
  addTask(taskConstructor: ITaskConstructor) {
    this.defaultTasks.push(new taskConstructor());
  }

  /**
   * @method addDefaults
   *
   * Adds an array default task to the task list, which is executed as part of checkup.
   *
   * @param taskConstructor {ITaskConstructor[]} an array of constructors representing a Task classes
   */
  addTasks(taskConstructors: ITaskConstructor[]) {
    taskConstructors.forEach((taskConstructor: ITaskConstructor) => {
      this.addTask(taskConstructor);
    });
  }

  /**
   * @method runTasks
   *
   * Runs all tasks that have been added to the task list.
   */
  runTasks() {
    return this.eachTask((task: ITask) => {
      return task.run();
    });
  }

  /**
   * @private
   * @method eachTask
   *
   * Runs each task in parallel
   * @param fn {Function} the function expressing the wrapped task to run
   */
  private eachTask(fn: (task: ITask) => Promise<ITaskResult>) {
    return pMap(this.defaultTasks, fn);
  }
}
