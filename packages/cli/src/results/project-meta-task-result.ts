import { BaseTaskResult, TaskResult, ui, NumericalCardData } from '@checkup/core';

import { RepositoryInfo } from '../types';

export default class ProjectMetaTaskResult extends BaseTaskResult implements TaskResult {
  name!: string;
  version!: string;
  repository!: RepositoryInfo;

  stdout() {
    ui.styledHeader(this.meta.friendlyTaskName);
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

  json() {
    return {
      project: {
        name: this.name,
        version: this.version,
        repository: this.repository,
      },
    };
  }

  pdf() {
    // TODO: add in correct data type for CheckupMetaTaskResult
    return new NumericalCardData(this.meta, 22, 'this is a description of your result');
  }
}
