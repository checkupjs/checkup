import { TaskItemData, TaskResult, ui } from '@checkup/core';

export default class TypesTaskResult implements TaskResult {
  types!: TaskItemData[];

  findByType(typeName: string): TaskItemData | undefined {
    return this.types.find(type => type.type === typeName);
  }

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
