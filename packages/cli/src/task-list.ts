import * as debug from 'debug';
import * as pMap from 'p-map';
import * as convertHrtime from 'convert-hrtime';

import {
  Task,
  TaskListError,
  TaskName,
  RegisterableTaskList,
  ErrorKind,
  CheckupError,
} from '@checkup/core';
import { Result } from 'sarif';
import { taskResultComparator } from './task-result-comparator';

export type TaskFinderResult = { tasksFound: Task[]; tasksNotFound: (TaskName | string)[] };

/**
 * @class TaskList
 *
 * Represents a collection of tasks to run.
 */
export default class TaskListImpl implements RegisterableTaskList {
  private _categories: Map<string, Map<TaskName, Task>>;
  private _errors: TaskListError[];
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
      throw new CheckupError(ErrorKind.TaskCategoryRequired, {
        fullyQualifiedTaskName: task.fullyQualifiedTaskName,
      });
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
  findTask(
    taskName: TaskName,
    predicate: (task: Task) => boolean = (task) => task.taskName === taskName
  ): Task | undefined {
    return this.getTasks().find((task) => predicate(task));
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
   * @returns {Promise<[Result[], TaskListError[]]>}
   * @memberof TaskList
   */
  async runTask(taskName: TaskName): Promise<[Result[] | undefined, TaskListError[]]> {
    let result: Result[] | undefined;
    let task: Task | undefined = this.findTask(taskName);

    if (task === undefined) {
      throw new CheckupError(ErrorKind.TasksNotFound);
    }

    this.debug('start %s run', task.fullyQualifiedTaskName);

    try {
      result = await this._runTask(task);
      this.addErrors(task.fullyQualifiedTaskName, task.nonFatalErrors);
    } catch (error: unknown) {
      this.addErrors(task.fullyQualifiedTaskName, error as Error);
    }

    this.debug('%s run done', task.fullyQualifiedTaskName);

    return [result, this._errors];
  }

  /**
   * Runs all tasks that have been added to the task list.
   *
   * @method runTasks
   * @returns {Promise<[Result[], TaskListError[]]>}
   * @memberof TaskList
   */
  async runTasks(tasks?: Task[]): Promise<[Result[], TaskListError[]]> {
    let results = await this.eachTask(async (task: Task) => {
      let result;
      this.debug('start %s run', task.fullyQualifiedTaskName);

      try {
        result = await this._runTask(task);
        this.addErrors(task.fullyQualifiedTaskName, task.nonFatalErrors);
      } catch (error: unknown) {
        this.addErrors(task.fullyQualifiedTaskName, error as Error);
      }

      this.debug('%s run done', task.fullyQualifiedTaskName);
      return result;
    }, tasks);

    return [(results.flat().filter(Boolean) as Result[]).sort(taskResultComparator), this._errors];
  }

  private async _runTask(task: Task): Promise<Result[]> {
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

  private addErrors(taskName: TaskName, errors: Error | Error[]) {
    errors = Array.isArray(errors) ? errors : [errors];

    this._errors.push(
      ...errors.map((error) => {
        return {
          error,
          taskName,
        };
      })
    );
  }
}
