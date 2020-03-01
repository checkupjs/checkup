import * as pMap from 'p-map';

import { Task, TaskName, TaskResult } from '@checkup/core';

/**
 * @class TaskList
 *
 * Represents a collection of tasks to run.
 */
export default class TaskList {
  private registeredTasks: Map<TaskName, Task>;

  constructor() {
    this.registeredTasks = new Map<TaskName, Task>();
  }

  /**
   * @method registerTask
   *
   * Adds a default task to the task list, which is executed as part of checkup.
   *
   * @param taskConstructor {TaskConstructor} a constructor representing a Task class
   */
  registerTask(taskName: TaskName, task: Task) {
    this.registeredTasks.set(taskName, task);
  }

  /**
   * @method registerTasks
   *
   * Adds an array default task to the task list, which is executed as part of checkup.
   *
   * @param taskConstructor {TaskConstructor[]} an array of constructors representing a Task classes
   */
  // registerTasks(taskConstructors: TaskConstructor[], cliArguments: any) {
  //   taskConstructors.forEach((taskConstructor: TaskConstructor) => {
  //     this.registerTask(taskName, taskConstructor, cliArguments);
  //   });
  // }

  /**
   * Runs the task specified by the taskName parameter.
   *
   * @param {TaskName} taskName
   * @returns {Promise<TaskResult>}
   * @memberof TaskList
   */
  runTask(taskName: TaskName) {
    let task = this.registeredTasks.get(taskName);

    if (task === undefined) {
      throw new Error(`The ${taskName} task was not found`);
    }

    return task.run();
  }

  /**
   * Runs all tasks that have been added to the task list.
   *
   * @method runTasks
   * @memberof TaskList
   */
  runTasks() {
    return this.eachTask((task: Task) => {
      return task.run();
    });
  }

  /**
   * Runs each task in parallel
   *
   * @private
   * @method eachTask
   * @param fn {Function} the function expressing the wrapped task to run
   */
  private eachTask(fn: (task: Task) => Promise<TaskResult>) {
    return pMap([...this.registeredTasks.values()], fn);
  }
}
