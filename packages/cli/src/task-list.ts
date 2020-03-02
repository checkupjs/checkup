import * as pMap from 'p-map';

import { Category, Task, TaskClassification, TaskName, TaskResult } from '@checkup/core';

import PriorityMap from './priority-map';

/**
 * @class TaskList
 *
 * Represents a collection of tasks to run.
 */
export default class TaskList {
  private _categories: Map<Category, PriorityMap>;

  get categories() {
    return this._categories;
  }

  constructor() {
    this._categories = new Map<Category, PriorityMap>([
      [Category.Core, new PriorityMap()],
      [Category.Migration, new PriorityMap()],
    ]);
  }

  /**
   * @method registerTask
   *
   * Adds a default task to the task list, which is executed as part of checkup.
   * @param taskName {TaskName}
   * @param task {Task}
   */
  registerTask(taskName: TaskName, task: Task, taskClassification: TaskClassification) {
    let priorityMap = this._categories.get(taskClassification.category);
    priorityMap!.set(taskClassification.priority, taskName, task);
  }

  /**
   * Runs the task specified by the taskName parameter.
   *
   * @param {TaskName} taskName
   * @returns {Promise<TaskResult>}
   * @memberof TaskList
   */
  runTask(taskName: TaskName): Promise<TaskResult> {
    let task: Task | undefined;

    // TODO: Find a less gross way to do this
    for (let [, map] of this.categories) {
      task = map.getByName(taskName);

      if (task !== undefined) {
        break;
      }
    }

    if (task === undefined) {
      throw new Error(`The ${taskName} task was not found`);
    }

    return task.run();
  }

  /**
   * Runs all tasks that have been added to the task list.
   *
   * @method runTasks
   * @returns {Promise<TaskResult[]>}
   * @memberof TaskList
   */
  runTasks(): Promise<TaskResult[]> {
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
   * @returns {Promise<TaskResult[]>}
   */
  private eachTask(fn: (task: Task) => Promise<TaskResult>): Promise<TaskResult[]> {
    return pMap(
      [
        ...this._categories.get(Category.Core)!.values(),
        ...this._categories.get(Category.Migration)!.values(),
      ],
      fn
    );
  }
}
