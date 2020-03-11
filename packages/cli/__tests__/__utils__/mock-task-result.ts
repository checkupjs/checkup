import { BaseTaskResult, TaskMetaData, TaskResult } from '@checkup/core';

export default class MockTaskResult extends BaseTaskResult implements TaskResult {
  constructor(meta: TaskMetaData, public result: string) {
    super(meta);
  }

  stdout() {
    process.stdout.write(`Result for ${this.meta.taskName}`);
  }

  json() {
    return {
      meta: this.meta,
      result: this.result,
    };
  }

  pdf() {
    return undefined;
  }
}
