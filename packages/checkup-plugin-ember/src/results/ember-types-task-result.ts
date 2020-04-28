import { BaseTaskResult, TableData, TaskItemData, TaskResult, ui } from '@checkup/core';

export default class EmberTypesTaskResult extends BaseTaskResult implements TaskResult {
  types!: TaskItemData[];

  findByType(typeName: string): TaskItemData | undefined {
    return this.types.find((type) => type.type === typeName);
  }

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(this.types, { type: {}, total: {} });
    });
  }

  toJson() {
    return { meta: this.meta, result: { types: this.types } };
  }

  toReportData() {
    return [
      new TableData(
        this.meta,
        this.types.map((type) => ({
          name: type.type,
          value: type.total,
        }))
      ),
    ];
  }
}
