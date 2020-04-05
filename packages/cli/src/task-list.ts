import * as pMap from 'p-map';

import { Category, Task, TaskName, TaskResult } from '@checkup/core';

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
    this._categories = new Map<Category, PriorityMap>();
  }

  /**
   * Adds a default task to the task list, which is executed as part of checkup.
   *
   * @method registerTask
   * @param taskName {TaskName}
   * @param task {Task}
   * @param taskClassification
   */
  registerTask(task: Task) {
    let priorityMap = this.getByCategory(task.meta.taskClassification.category);
    priorityMap!.setTaskByPriority(task.meta.taskClassification.priority, task.meta.taskName, task);
  }

  /**
   * Runs the task specified by the taskName parameter.
   *
   * @method runTask
   * @param {TaskName} taskName
   * @returns {Promise<TaskResult>}
   * @memberof TaskList
   */
  runTask(taskName: TaskName): Promise<TaskResult> {
    let task: Task | undefined;

    // TODO: Find a less gross way to do this
    for (let [, map] of this.categories) {
      task = map.getTask(taskName);

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
  async runTasks(): Promise<TaskResult[]> {
    let results = await this.eachTask((task: Task) => {
      return task.run();
    });

    results.sort((a: TaskResult, b: TaskResult) => {
      return a.compareTo(b);
    });

    return results;
  }

  /**
   * Gets a priorityMap from the category map
   *
   * @private
   * @method getByCategory
   * @param category
   */
  private getByCategory(category: Category) {
    if (!this._categories.has(category)) {
      this._categories.set(category, new PriorityMap());
    }

    return this._categories.get(category);
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
    return pMap(this.getTasks(), fn);
  }

  /**
   * Gets all tasks from all priorityMaps
   *
   * @private
   * @method getTasks
   */
  private getTasks() {
    let values: Task[] = [];

    this._categories.forEach(category => {
      values = [...values, ...category.values()];
    });

    return values;
  }
}
