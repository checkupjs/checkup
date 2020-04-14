import * as debug from 'debug';
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
  debug: debug.Debugger;

  get categories() {
    return this._categories;
  }

  constructor() {
    this._categories = new Map<Category, PriorityMap>();
    this.debug = debug('checkup:task');
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
   * Evaluates whether a task exists
   *
   * @method hasTask
   * @param taskName The name of the task to check for existence of
   */
  hasTask(taskName: TaskName): boolean {
    return this.findTask(taskName) !== undefined;
  }

  /**
   * Finds a task by task name
   *
   * @method findTask
   * @param taskName The name of the task to find
   */
  findTask(taskName: TaskName): Task | undefined {
    return this.getTasks().find((task) => task.meta.taskName === taskName);
  }

  /**
   * Runs the task specified by the taskName parameter.
   *
   * @method runTask
   * @param {TaskName} taskName
   * @returns {Promise<TaskResult>}
   * @memberof TaskList
   */
  async runTask(taskName: TaskName): Promise<TaskResult> {
    let task: Task | undefined = this.findTask(taskName);

    if (task === undefined) {
      throw new Error(`The ${taskName} task was not found`);
    }

    return await task.run();
  }

  /**
   * Runs all tasks that have been added to the task list.
   *
   * @method runTasks
   * @returns {Promise<TaskResult[]>}
   * @memberof TaskList
   */
  async runTasks(): Promise<TaskResult[]> {
    let results = await this.eachTask(async (task: Task) => {
      this.debug('start %s run', task.constructor.name);

      let result = await task.run();

      this.debug('%s run done', task.constructor.name);
      return result;
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

    this._categories.forEach((category) => {
      values = [...values, ...category.values()];
    });

    return values;
  }
}
