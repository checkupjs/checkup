import { BaseTaskResult, TaskResult, ui } from '@checkup/core';

export default class EmberProjectTaskResult extends BaseTaskResult implements TaskResult {
  type!: string;
  name!: string;
  version!: string;

  toConsole() {
    ui.styledHeader(this.meta.friendlyTaskName);
    ui.blankLine();
    ui.styledObject({
      type: this.type,
    });
    ui.blankLine();
  }

  toJson() {
    return {
      [this.meta.taskName]: { type: this.type },
    };
  }
}
