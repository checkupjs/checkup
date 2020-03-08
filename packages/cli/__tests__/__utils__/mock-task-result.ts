import { BaseTaskResult, Task, TaskResult } from '@checkup/core';

export default class MockTaskResult extends BaseTaskResult implements TaskResult {
  constructor(task: Task, public result: string) {
    super(task);
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
}
