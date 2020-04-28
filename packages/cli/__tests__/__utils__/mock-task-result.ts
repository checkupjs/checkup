import { BaseTaskResult, NumericalCardData, TaskMetaData, TaskResult } from '@checkup/core';

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

  toReportData() {
    return [new NumericalCardData(this.meta, this.result, 'this is a description of your result')];
  }
}
