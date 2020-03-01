import { TaskResult, ui } from '@checkup/core';

import ProjectInfoTask from '../tasks/project-info-task';
import { RepositoryInfo } from '../types';

export default class ProjectInfoTaskResult implements TaskResult {
  name!: string;
  version!: string;
  repository!: RepositoryInfo;

  toConsole() {
    ui.styledHeader(ProjectInfoTask.friendlyTaskName);
    ui.blankLine();
    ui.styledObject({
      name: this.name,
      version: this.version,
    });
    ui.blankLine();

    ui.styledHeader('Repository Information');
    ui.styledObject({
      Age: this.repository.age,
      'Active days': this.repository.activeDays,
      'Total commits': this.repository.totalCommits,
      'Total files': this.repository.totalFiles,
    });
    ui.blankLine();
  }

  toJson() {
    return {
      [ProjectInfoTask.taskName]: {
        name: this.name,
        version: this.version,
        repository: this.repository,
      },
    };
  }
}
