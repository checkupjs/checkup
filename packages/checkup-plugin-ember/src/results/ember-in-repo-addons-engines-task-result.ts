import { BaseTaskResult, TaskResult, ui, SummaryResult } from '@checkup/core';

export default class EmberInRepoAddonEnginesTaskResult extends BaseTaskResult
  implements TaskResult {
  data!: SummaryResult[];

  process(data: SummaryResult[]) {
    this.data = data;
  }

  toConsole() {
    if (this.data.every((summaryItem) => summaryItem.count === 0)) {
      return;
    }

    ui.section(this.meta.friendlyTaskName, () => {
      this.data.forEach((summaryItem) => {
        ui.log(`${summaryItem.key}: ${summaryItem.count}`);
      });
    });
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data,
    };
  }
}
