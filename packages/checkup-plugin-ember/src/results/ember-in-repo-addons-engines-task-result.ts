import { BaseTaskResult, TaskResult, ui, SummaryData } from '@checkup/core';

export default class EmberInRepoAddonEnginesTaskResult extends BaseTaskResult
  implements TaskResult {
  data!: SummaryData[];

  process(data: SummaryData[]) {
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
