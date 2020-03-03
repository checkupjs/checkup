import { BaseTaskResult, TaskItemData, TaskResult, ui } from '@checkup/core';

export default class TypesTaskResult extends BaseTaskResult implements TaskResult {
  types!: TaskItemData[];

  findByType(typeName: string): TaskItemData | undefined {
    return this.types.find(type => type.type === typeName);
  }

  toConsole() {
    ui.styledHeader(this.meta.friendlyTaskName);
    ui.blankLine();
    ui.table(this.types, { type: {}, total: {} });
    ui.blankLine();
  }

  toJson() {
    return { [this.meta.taskName]: this.types };
  }
}
