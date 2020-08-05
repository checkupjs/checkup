import { BaseTaskResult, TaskResult, MultiValueResult } from '@checkup/core';

export default class EmberOctaneMigrationStatusTaskResult extends BaseTaskResult
  implements TaskResult {
  data: MultiValueResult[] = [];

  process(data: MultiValueResult[]) {
    this.data = data;
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data,
    };
  }
}
