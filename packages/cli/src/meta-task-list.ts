import * as debug from 'debug';
import * as pMap from 'p-map';

import { MetaTask, MetaTaskResult } from './types';

import { TaskName } from '@checkup/core';

export default class MetaTaskList {
  public _entries: Map<TaskName, MetaTask>;
  debug: debug.Debugger;

  constructor() {
    this._entries = new Map<TaskName, MetaTask>();
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

  async runTask(taskName: TaskName): Promise<MetaTaskResult> {
    let task: MetaTask | undefined = this.findTask(taskName);

    if (task === undefined) {
      throw new Error(`The ${taskName} task was not found`);
    }

    return await task.run();
  }

  async runTasks(): Promise<MetaTaskResult[]> {
    let results = await this.eachTask(async (task: MetaTask) => {
      this.debug('start %s run', task.constructor.name);

      let result = await task.run();

      this.debug('%s run done', task.constructor.name);
      return result;
    });

    return results;
  }

  private eachTask(fn: (task: MetaTask) => Promise<MetaTaskResult>): Promise<MetaTaskResult[]> {
    return pMap([...this._entries.values()], fn);
  }
}
