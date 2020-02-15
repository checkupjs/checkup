import { TaskResult, ui } from '@checkup/core';

export default class ProjectInfoTaskResult implements TaskResult {
  type!: string;
  name!: string;
  version!: string;

  toConsole() {
    ui.styledHeader('Project Info');
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
      'project-info': { name: this.name, type: this.type, version: this.version },
    };
  }
}
