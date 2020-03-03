import { BaseTaskResult, TaskResult, ui } from '@checkup/core';

import { RepositoryInfo } from '../types';

export default class ProjectInfoTaskResult extends BaseTaskResult implements TaskResult {
  name!: string;
  version!: string;
  repository!: RepositoryInfo;

  toConsole() {
    ui.styledHeader(this.meta.friendlyTaskName);
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
      [this.meta.taskName]: {
        name: this.name,
        version: this.version,
        repository: this.repository,
      },
    };
  }
}
