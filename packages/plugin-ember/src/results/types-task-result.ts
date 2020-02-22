import { TaskItemData, TaskResult, ui } from '@checkup/core';

import { TypesTask } from '../tasks';

export default class TypesTaskResult implements TaskResult {
  types!: TaskItemData[];

  findByType(typeName: string): TaskItemData | undefined {
    return this.types.find(type => type.type === typeName);
  }

  toConsole() {
    ui.styledHeader(TypesTask.friendlyTaskName);
    ui.blankLine();
    ui.table(this.types, { type: {}, total: {} });
    ui.blankLine();
  }

  toJson() {
    return { [TypesTask.taskName]: this.types };
  }
}
