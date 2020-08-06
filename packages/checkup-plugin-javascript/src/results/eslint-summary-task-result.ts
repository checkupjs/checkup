import { BaseTaskResult, TaskResult, MultiValueResult } from '@checkup/core';

export default class EslintSummaryTaskResult extends BaseTaskResult implements TaskResult {
  data: MultiValueResult[] = [];

  process(data: MultiValueResult[]) {
    this.data = data;
  }
}
