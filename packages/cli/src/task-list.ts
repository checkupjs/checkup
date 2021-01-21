import * as debug from 'debug';
import * as pMap from 'p-map';
import * as convertHrtime from 'convert-hrtime';

import { Task, TaskError, TaskName } from '@checkup/core';
import { taskResultComparator } from './task-result-comparator';
import { Result } from 'sarif';

export type TaskFinderResult = { tasksFound: Task[]; tasksNotFound: (TaskName | string)[] };

/**
 * @class TaskList
 *
 * Represents a collection of tasks to run.
 */
export default class TaskList {
  private _categories: Map<string, Map<TaskName, Task>>;
  private _errors: TaskError[];
  private _timings: Record<TaskName, number>;
  debug: debug.Debugger;

  get categories() {
    return this._categories;
  }

  get timings() {
    return this._timings;
  }

  get size() {
    return this.getTasks().length;
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
    this._timings = {};
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
        `Task category can not be empty. Please add a category to ${task.fullyQualifiedTaskName}-task.`
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
    return this.find(taskName) !== undefined;
  }

  /**
   * Finds a task by task name
   *
   * @method findTask
   * @param taskName The name of the task to find
   */
  find(
    taskName: TaskName,
    predicate: (task: Task) => boolean = (task) => task.taskName === taskName
  ): Task | undefined {
    return this.getTasks().find(predicate);
  }

  /**
   * Finds tasks by task name
   *
   * @method findTasks
   * @param taskNames The name of the task to find
   */
  findAllByTaskName(...taskNames: TaskName[]): TaskFinderResult {
    let tasksFound: Task[] = [];
    let tasksNotFound: TaskName[] = [];
    let availableTasks = this.getTasks();

    taskNames.forEach((taskName) => {
      let taskFound = false;

      for (let availableTask of availableTasks) {
        if (availableTask.fullyQualifiedTaskName === taskName) {
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

  findAllByCategory(...categories: string[]): TaskFinderResult {
    let tasksFound: Task[] = [];
    let tasksNotFound: string[] = [];

    categories.forEach((category) => {
      let tasks = this._categories.get(category);

      if (tasks !== undefined) {
        tasksFound = [...tasksFound, ...tasks.values()];
      } else {
        tasksNotFound.push(category);
      }
    });

    return { tasksFound, tasksNotFound };
  }

  findAllByGroup(...groups: string[]): TaskFinderResult {
    let tasksFound: Task[] = [];
    let tasksNotFound: string[] = [];
    let availableTasks = this.getTasks();

    groups.forEach((group) => {
      let taskFound = false;

      for (let availableTask of availableTasks) {
        if (availableTask.group === group) {
          taskFound = true;
          tasksFound.push(availableTask);
        }
      }

      if (taskFound === false) {
        tasksNotFound.push(group);
      }
    });

    return { tasksFound, tasksNotFound };
  }

  /**
   * Runs the task specified by the taskName parameter.
   *
   * @method runTask
   * @param {TaskName} taskName
   * @returns {Promise<[Result[], TaskError[]]>}
   * @memberof TaskList
   */
  async runTask(taskName: TaskName): Promise<[Result[] | undefined, TaskError[]]> {
    let result: Result[] | undefined;
    let task: Task | undefined = this.find(taskName);

    if (task === undefined) {
      throw new Error(`The ${taskName} task was not found`);
    }

    this.debug('start %s run', task.fullyQualifiedTaskName);

    try {
      result = await this._runTask(task);
    } catch (error) {
      this.addError(task.fullyQualifiedTaskName, error);
    }

    this.debug('%s run done', task.fullyQualifiedTaskName);

    return [result, this._errors];
  }

  /**
   * Runs all tasks that have been added to the task list.
   *
   * @method runTasks
   * @returns {Promise<[Result[], TaskError[]]>}
   * @memberof TaskList
   */
  async runTasks(tasks?: Task[]): Promise<[Result[], TaskError[]]> {
    let results = await this.eachTask(async (task: Task) => {
      let result;
      this.debug('start %s run', task.fullyQualifiedTaskName);

      try {
        result = await this._runTask(task);
      } catch (error) {
        this.addError(task.fullyQualifiedTaskName, error);
      }

      this.debug('%s run done', task.fullyQualifiedTaskName);
      return result;
    }, tasks);

    return [(results.flat().filter(Boolean) as Result[]).sort(taskResultComparator), this._errors];
  }

  private async _runTask(task: Task) {
    let t = process.hrtime();
    let result = await task.run();
    t = process.hrtime(t);

    this._timings[task.fullyQualifiedTaskName] = convertHrtime(t).seconds;

    return result;
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
   * @returns {Promise<Result[][]>}
   */
  private eachTask(
    fn: (task: Task) => Promise<Result[] | undefined>,
    tasksToRun?: Task[]
  ): Promise<(Result[] | undefined)[]> {
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
  getTasks() {
    let values: Task[] = [];

    this._categories.forEach((category) => {
      values = [...values, ...category.values()];
    });

    return values;
  }

  private addError(taskName: TaskName, error: Error) {
    this._errors.push({ taskName, error });
  }
}
