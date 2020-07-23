import { BaseTaskResult, TaskResult, ui, SummaryResult } from '@checkup/core';

export default class EmberTypesTaskResult extends BaseTaskResult implements TaskResult {
  data!: SummaryResult[];

  process(data: SummaryResult[]) {
    this.data = data;
  }

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(
        this.data.map((type) => {
          return {
            key: type.key,
            count: type.count,
          };
        }),
        {
          key: { header: 'Types' },
          count: { header: 'Count' },
        }
      );
    });
  }

  toJson() {
    return { info: this.meta, result: this.data };
  }
}
