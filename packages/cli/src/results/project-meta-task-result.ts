import { MetaTaskResult, RepositoryInfo } from '../types';

import BaseMetaTaskResult from '../base-meta-task-result';
import { CheckupConfig, RunFlags } from '@checkup/core';
import { JsonObject } from 'type-fest';

export default class ProjectMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
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

  toJson() {
    return this.data as JsonObject;
  }
}
