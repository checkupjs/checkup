import { MetaTaskResult, RepositoryInfo } from '../types';

import BaseMetaTaskResult from '../base-meta-task-result';
import { ui } from '@checkup/core';

export default class ProjectMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
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
}
