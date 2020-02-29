import { TaskResult, ui } from '@checkup/core';

import ProjectInfoTask from '../tasks/project-info-task';

export default class ProjectInfoTaskResult implements TaskResult {
  type!: string;
  name!: string;
  version!: string;
  repository!: RepositoryInfo;

  toConsole() {
    ui.styledHeader(ProjectInfoTask.friendlyTaskName);
    ui.blankLine();
    ui.styledObject({
      name: this.name,
      type: this.type,
      version: this.version,
    });
    ui.blankLine();

    ui.styledHeader('Repository Information');
    ui.styledObject(this.repository);
    ui.blankLine();
  }

  toJson() {
    return {
      [ProjectInfoTask.taskName]: {
        name: this.name,
        type: this.type,
        version: this.version,
        repository: this.repository,
      },
    };
  }
}
