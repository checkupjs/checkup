import { BaseTaskResult, TaskResult, SummaryResult } from '@checkup/core';

export default class EmberTypesTaskResult extends BaseTaskResult implements TaskResult {
  data!: SummaryResult[];

  process(data: SummaryResult[]) {
    this.data = data;
  }

  toJson() {
    return { info: this.meta, result: this.data };
  }
}
