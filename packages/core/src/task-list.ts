import * as pMap from 'p-map';

import { Task, TaskConstructor, TaskResult } from './types';

/**
 * @class TaskList
 *
 * Represents a collection of tasks to run.
 */
export default class TaskList {
  private defaultTasks: Task[];

  /**
   *
   * @param results {TaskResult[]} the results object that aggregates data together for output.
   */
  constructor() {
    this.defaultTasks = [];
  }

  /**
   * @method addDefault
   *
   * Adds a default task to the task list, which is executed as part of checkup.
   *
   * @param taskConstructor {TaskConstructor} a constructor representing a Task class
   */
  addTask(taskConstructor: TaskConstructor, args: any) {
    this.defaultTasks.push(new taskConstructor(args));
  }

  /**
   * @method addDefaults
   *
   * Adds an array default task to the task list, which is executed as part of checkup.
   *
   * @param taskConstructor {TaskConstructor[]} an array of constructors representing a Task classes
   */
  addTasks(taskConstructors: TaskConstructor[], args: any) {
    taskConstructors.forEach((taskConstructor: TaskConstructor) => {
      this.addTask(taskConstructor, args);
    });
  }

  /**
   * @method runTasks
   *
   * Runs all tasks that have been added to the task list.
   */
  runTasks() {
    return this.eachTask((task: Task) => {
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
  private eachTask(fn: (task: Task) => Promise<TaskResult>) {
    return pMap(this.defaultTasks, fn);
  }
}
