import {
  CheckupConfig,
  TaskIdentifier,
  normalizePaths,
  TaskContext,
  getShorthandName,
} from '@checkup/core';
import * as debug from 'debug';
import * as crypto from 'crypto';
import * as stringify from 'json-stable-stringify';
import { MetaTask, MetaTaskResult } from '../types';

import ProjectMetaTaskResult from '../results/project-meta-task-result';
import { getRepositoryInfo } from '../utils/repository';
import { getVersion } from '../utils/get-version';

function getConfigHash(checkupConfig: CheckupConfig) {
  let configAsJson = stringify(checkupConfig);

  return crypto.createHash('md5').update(configAsJson).digest('hex');
}

export default class ProjectMetaTask implements MetaTask {
  meta: TaskIdentifier = {
    taskName: 'project',
    taskDisplayName: 'Project',
  };
  context!: TaskContext;
  _pluginName: string;
  debug: debug.Debugger;

  constructor(pluginName: string, context: TaskContext) {
    this._pluginName = getShorthandName(pluginName);
    this.context = context;

    this.debug = debug('checkup:task');
  }

  async run(): Promise<MetaTaskResult> {
    let result: ProjectMetaTaskResult = new ProjectMetaTaskResult(this.meta);
    let package_ = this.context.pkg;
    let repositoryInfo = await getRepositoryInfo(this.context.cliFlags.cwd);

    let { config, tasks, format, outputFile, excludePaths } = this.context.cliFlags;

    result.data = {
      project: {
        name: package_.name || '',
        version: package_.version || '',
        repository: repositoryInfo,
      },

      cli: {
        configHash: getConfigHash(this.context.config),
        config: this.context.config,
        version: getVersion(),
        schema: 1,
        flags: {
          config,
          tasks,
          format,
          outputFile,
          excludePaths,
        },
      },

      analyzedFilesCount: normalizePaths(this.context.paths, this.context.cliFlags.cwd),
    };

    return result;
  }
}
