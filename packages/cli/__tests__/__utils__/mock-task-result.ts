import { BaseTaskResult, TaskMetaData, TaskResult, ActionConfig } from '@checkup/core';

export default class MockTaskResult extends BaseTaskResult implements TaskResult {
  constructor(meta: TaskMetaData, config: ActionConfig[], public result: any) {
    super(meta, config);
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
