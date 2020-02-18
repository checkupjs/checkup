import { TaskItemData, TaskResult, ui } from '@checkup/core';

export default class TypesTaskResult implements TaskResult {
  types!: TaskItemData[];

  toConsole() {
    ui.styledHeader('Types');
    ui.blankLine();
    ui.table(this.types, { type: {}, total: {} });
    ui.blankLine();
  }

  toJson() {
    return { types: this.types };
  }
}
