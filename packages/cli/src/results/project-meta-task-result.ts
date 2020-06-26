import { MetaTaskResult, OutputPosition, RepositoryInfo } from '../types';

import BaseMetaTaskResult from '../base-meta-task-result';
import { ui } from '@checkup/core';

export default class ProjectMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
  outputPosition: OutputPosition = OutputPosition.Header;
  name!: string;
  version!: string;
  repository!: RepositoryInfo;
  analyzedFiles!: string[];

  toConsole() {
    let filesForCheckupString =
      this.repository.totalFiles !== this.filesForCheckup.length
        ? ` (${ui.emphasize(`${this.filesForCheckup.length.toString()} files`)} analyzed)`
        : '';

    ui.blankLine();
    ui.log(
      `Checkup report generated for ${ui.emphasize(
        `${this.name} v${this.version}`
      )}${filesForCheckupString}`
    );
    ui.blankLine();
    ui.log(
      `This project is ${ui.emphasize(`${this.repository.age} old`)}, with ${ui.emphasize(
        `${this.repository.activeDays} active days`
      )}, ${ui.emphasize(`${this.repository.totalCommits} commits`)} and ${ui.emphasize(
        `${this.repository.totalFiles} files`
      )}.`
    );
    ui.blankLine();
  }

  toJson() {
    return {
      project: {
        name: this.name,
        version: this.version,
        repository: this.repository,
        filesAnalyzed: this.filesForCheckup.length,
      },
    };
  }
}
