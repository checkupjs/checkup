import { BaseTaskResult, TaskMetaData, TaskResult } from '@checkup/core';

export default class MockTaskResult extends BaseTaskResult implements TaskResult {
  constructor(meta: TaskMetaData, public result: any) {
    super(meta);
  }

  toConsole() {
    process.stdout.write(`Result for ${this.meta.taskName}`);
  }

  toJson() {
    return {
      meta: this.meta,
      result: this.result,
    };
  }
}
