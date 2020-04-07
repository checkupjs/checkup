import { BaseTaskResult, TaskItemData, TaskResult, ui } from '@checkup/core';

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

  pdf() {
    return undefined;
  }
}
