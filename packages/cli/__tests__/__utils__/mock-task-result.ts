import {
  BaseTaskResult,
  Category,
  TaskMetaData,
  TaskResult,
  NumericalCardData,
} from '@checkup/core';

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
    return new NumericalCardData(this.meta, this.result, 'this is a description of your result');
  }
}
