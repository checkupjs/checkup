import { MetaTask, MetaTaskResult, TaskIdentifier } from '../../src/types';

import { BaseTask } from '@checkup/core';
import MockMetaTaskResult from './mock-meta-task-result';

const DEFAULT_META = {
  taskName: 'mock-task',
  friendlyTaskName: 'Mock Task',
};

export default class MockMetaTask extends BaseTask implements MetaTask {
  meta: TaskIdentifier;

  constructor(meta: TaskIdentifier = DEFAULT_META) {
    super({});
    this.meta = meta;
  }

  async run(): Promise<MetaTaskResult> {
    return new MockMetaTaskResult(this.meta, `${this.meta.taskName} is being run`);
  }
}
