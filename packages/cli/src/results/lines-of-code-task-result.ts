import { BaseTaskResult, TaskResult, ui, LookupValueResult } from '@checkup/core';

export default class LinesOfCodeTaskResult extends BaseTaskResult implements TaskResult {
  data!: LookupValueResult[];

  process(data: LookupValueResult[]) {
    this.data = data;
  }

  toConsole() {
    let { dataSummary } = this.data[0];
    ui.section(this.meta.friendlyTaskName, () => {
      ui.sectionedBar(
        Object.entries(dataSummary.values).map(([key, count]) => {
          return { title: key, count };
        }),
        dataSummary.total,
        'lines'
      );
    });
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data,
    };
  }
}
