import { BaseTaskResult, TaskResult, SummaryResult } from '@checkup/core';

export default class EmberInRepoAddonEnginesTaskResult extends BaseTaskResult
  implements TaskResult {
  data!: SummaryResult[];

  process(data: SummaryResult[]) {
    this.data = data;
  }
}
