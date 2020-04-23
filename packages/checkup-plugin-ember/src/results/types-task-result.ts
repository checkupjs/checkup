import { BaseTaskResult, TaskItemData, TaskResult, ui, TableData } from '@checkup/core';

export default class TypesTaskResult extends BaseTaskResult implements TaskResult {
  types!: TaskItemData[];

  findByType(typeName: string): TaskItemData | undefined {
    return this.types.find((type) => type.type === typeName);
  }

  stdout() {
    ui.styledHeader(this.meta.friendlyTaskName);
    ui.blankLine();
    ui.table(this.types, { type: {}, total: {} });
    ui.blankLine();
  }

  json() {
    return { meta: this.meta, result: { types: this.types } };
  }

  html() {
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
