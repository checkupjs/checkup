import * as debug from 'debug';
import * as pMap from 'p-map';

import { MetaTask, MetaTaskResult } from './types';
import { TaskError, TaskName } from '@checkup/core';

export default class MetaTaskList {
  public _entries: Map<TaskName, MetaTask>;
  private _errors: TaskError[];
  debug: debug.Debugger;

  constructor() {
    this._entries = new Map<TaskName, MetaTask>();
    this._errors = [];
    this.debug = debug('checkup:meta-task');
  }

  registerTask(task: MetaTask) {
    this._entries.set(task.meta.taskName, task);
  }

  hasTask(taskName: TaskName): boolean {
    return this._entries.has(taskName);
  }

  findTask(taskName: TaskName): MetaTask | undefined {
    return this._entries.get(taskName);
  }

  async runTask(taskName: TaskName): Promise<[MetaTaskResult | undefined, TaskError[]]> {
    let result: MetaTaskResult | undefined;
    let task: MetaTask | undefined = this.findTask(taskName);

    if (task === undefined) {
      throw new Error(`The ${taskName} task was not found`);
    }

    this.debug('start %s run', task.meta.taskName);

    try {
      result = await task.run();
    } catch (error) {
      this.addError(task.meta.taskName, error.message);
    }

    this.debug('%s run done', task.meta.taskName);

    return [result, this._errors];
  }

  async runTasks(): Promise<[MetaTaskResult[], TaskError[]]> {
    let results = await this.eachTask(async (task: MetaTask) => {
      let result;
      this.debug('start %s run', task.meta.taskName);

      try {
        result = await task.run();
      } catch (error) {
        this.addError(task.meta.taskName, error.message);
      }

      this.debug('%s run done', task.meta.taskName);
      return result;
    });

    return [results.filter(Boolean) as MetaTaskResult[], this._errors];
  }

  private eachTask(
    fn: (task: MetaTask) => Promise<MetaTaskResult | undefined>
  ): Promise<(MetaTaskResult | undefined)[]> {
    return pMap([...this._entries.values()], fn);
  }

  private addError(taskName: TaskName, error: string) {
    this._errors.push({ taskName, error });
  }
}
