import { BaseTaskResult, TaskResult, LookupValueResult } from '@checkup/core';

export default class LinesOfCodeTaskResult extends BaseTaskResult implements TaskResult {
  data!: LookupValueResult[];

  process(data: LookupValueResult[]) {
    this.data = data;
  }
}
