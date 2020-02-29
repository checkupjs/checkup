import { TaskResult, ui } from '@checkup/core';

import { EmberProjectTask } from '../tasks';

export default class EmberProjectTaskResult implements TaskResult {
  type!: string;
  name!: string;
  version!: string;

  toConsole() {
    ui.styledHeader(EmberProjectTask.friendlyTaskName);
    ui.blankLine();
    ui.styledObject({
      type: this.type,
    });
    ui.blankLine();
  }

  toJson() {
    return {
      [EmberProjectTask.taskName]: { type: this.type },
    };
  }
}
