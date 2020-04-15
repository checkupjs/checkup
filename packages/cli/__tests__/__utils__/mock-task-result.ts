import { BaseTaskResult, Category, TaskMetaData, TaskResult } from '@checkup/core';

export default class MockTaskResult extends BaseTaskResult implements TaskResult {
  constructor(meta: TaskMetaData, public result: any) {
    super(meta);
  }

  stdout() {
    process.stdout.write(`Result for ${this.meta.taskName}`);
  }

  json() {
    if (this.meta.taskClassification.category === Category.Meta) {
      return {
        [this.meta.taskName]: this.result,
      };
    } else {
      return {
        meta: this.meta,
        result: this.result,
      };
    }
  }

  pdf() {
    return undefined;
  }
}
