import { TaskResult, ui } from '@checkup/core';

import { ProjectInfoTask } from '../tasks';

export default class ProjectInfoTaskResult implements TaskResult {
  type!: string;
  name!: string;
  version!: string;

  toConsole() {
    ui.styledHeader(ProjectInfoTask.friendlyTaskName);
    ui.blankLine();
    ui.styledObject({
      name: this.name,
      type: this.type,
      version: this.version,
    });
    ui.blankLine();
  }

  toJson() {
    return {
      [ProjectInfoTask.taskName]: { name: this.name, type: this.type, version: this.version },
    };
  }
}
