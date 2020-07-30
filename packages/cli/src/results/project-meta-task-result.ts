import { MetaTaskResult, OutputPosition, RepositoryInfo } from '../types';

import BaseMetaTaskResult from '../base-meta-task-result';
import { ui, CheckupConfig, RunFlags } from '@checkup/core';
import { JsonObject } from 'type-fest';

export default class ProjectMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
  outputPosition: OutputPosition = OutputPosition.Header;

  data!: {
    project: {
      name: string;
      version: string;
      repository: RepositoryInfo;
    };

    cli: {
      configHash: string;
      config: CheckupConfig;
      version: string;
      schema: number;
      flags: Partial<RunFlags>;
    };

    analyzedFilesCount: string[];
  };

  toConsole() {
    let { analyzedFilesCount } = this.data;
    let { name, version, repository } = this.data.project;
    let { version: cliVersion, configHash } = this.data.cli;

    let analyzedFilesMessage =
      repository.totalFiles !== analyzedFilesCount.length
        ? ` (${ui.emphasize(`${analyzedFilesCount.length.toString()} files`)} analyzed)`
        : '';

    ui.blankLine();
    ui.log(
      `Checkup report generated for ${ui.emphasize(`${name} v${version}`)}${analyzedFilesMessage}`
    );
    ui.blankLine();
    ui.log(
      `This project is ${ui.emphasize(`${repository.age} old`)}, with ${ui.emphasize(
        `${repository.activeDays} active days`
      )}, ${ui.emphasize(`${repository.totalCommits} commits`)} and ${ui.emphasize(
        `${repository.totalFiles} files`
      )}.`
    );
    ui.blankLine();

    ui.dimmed(`checkup v${cliVersion}`);
    ui.dimmed(`config ${configHash}`);
    ui.blankLine();
  }

  toJson() {
    return this.data as JsonObject;
  }
}
