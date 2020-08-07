import * as debug from 'debug';
import * as pMap from 'p-map';

import { Task, TaskError, TaskName, TaskResult } from '@checkup/core';
import { taskResultComparator } from './task-result-comparator';

/**
 * @class TaskList
 *
 * Represents a collection of tasks to run.
 */
export default class TaskList {
  private _categories: Map<string, Map<TaskName, Task>>;
  private _errors: TaskError[];
  debug: debug.Debugger;

  get categories() {
    return this._categories;
  }

  /**
   * @returns {string[]} The list of fully qualified task names.
   */
  get fullyQualifiedTaskNames() {
    return this.getTasks()
      .map((task) => task.fullyQualifiedTaskName)
      .sort();
  }

  constructor() {
    this._categories = new Map<string, Map<TaskName, Task>>();
    this._errors = [];
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
    if (task.category === '') {
      throw new Error(
        `Task category can not be empty. Please add a category to ${task.taskName}-task.`
      );
    }
    let categoryMap = this.getByCategory(task.category);
    categoryMap!.set(task.taskName, task);
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
    return this.getTasks().find((task) => task.taskName === taskName);
  }

  /**
   * Finds tasks by task name
   *
   * @method findTasks
   * @param taskNames The name of the task to find
   */
  findTasks(...taskNames: TaskName[]): { tasksFound: Task[]; tasksNotFound: TaskName[] } {
    let tasksFound: Task[] = [];
    let tasksNotFound: TaskName[] = [];
    let availableTasks = this.getTasks();

    taskNames.forEach((taskName) => {
      let taskFound = false;

      for (let availableTask of availableTasks) {
        if (availableTask.taskName === taskName) {
          taskFound = true;
          tasksFound.push(availableTask);
          break;
        }
      }

      if (taskFound === false) {
        tasksNotFound.push(taskName);
      }
    });

    return { tasksFound, tasksNotFound };
  }

  /**
   * Runs the task specified by the taskName parameter.
   *
   * @method runTask
   * @param {TaskName} taskName
   * @returns {Promise<TaskResult>}
   * @memberof TaskList
   */
  async runTask(taskName: TaskName): Promise<[TaskResult | undefined, TaskError[]]> {
    let result: TaskResult | undefined;
    let task: Task | undefined = this.findTask(taskName);

    if (task === undefined) {
      throw new Error(`The ${taskName} task was not found`);
    }

    this.debug('start %s run', task.fullyQualifiedTaskName);

    try {
      result = await task.run();
    } catch (error) {
      this.addError(task.taskName, error.message);
    }

    this.debug('%s run done', task.fullyQualifiedTaskName);

    return [result, this._errors];
  }

  /**
   * Runs all tasks that have been added to the task list.
   *
   * @method runTasks
   * @returns {Promise<TaskResult[]>}
   * @memberof TaskList
   */
  async runTasks(tasks?: Task[]): Promise<[TaskResult[], TaskError[]]> {
    let results = await this.eachTask(async (task: Task) => {
      let result;
      this.debug('start %s run', task.fullyQualifiedTaskName);

      try {
        result = await task.run();
      } catch (error) {
        this.addError(task.taskName, error.message);
      }

      this.debug('%s run done', task.fullyQualifiedTaskName);
      return result;
    }, tasks);

    return [(results.filter(Boolean) as TaskResult[]).sort(taskResultComparator), this._errors];
  }

  /**
   * Gets a taskTypeMap from the type map
   *
   * @private
   * @method getByCategory
   * @param category
   */
  private getByCategory(category: string): Map<TaskName, Task> | undefined {
    if (!this._categories.has(category)) {
      this._categories.set(category, new Map<TaskName, Task>());
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
  private eachTask(
    fn: (task: Task) => Promise<TaskResult | undefined>,
    tasksToRun?: Task[]
  ): Promise<(TaskResult | undefined)[]> {
    let availableTasks = tasksToRun || this.getTasks();
    return pMap(
      availableTasks.filter((task) => task.enabled),
      fn
    );
  }

  /**
   * Gets all tasks from all taskTypeMaps
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

  private addError(taskName: TaskName, error: string) {
    this._errors.push({ taskName, error });
  }
}
