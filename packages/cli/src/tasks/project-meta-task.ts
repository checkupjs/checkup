import { BaseTask, TaskIdentifier } from '@checkup/core';
import { MetaTask, MetaTaskResult } from '../types';

import ProjectMetaTaskResult from '../results/project-meta-task-result';
import { getRepositoryInfo } from '../helpers/repository';

export default class ProjectMetaTask extends BaseTask implements MetaTask {
  meta: TaskIdentifier = {
    taskName: 'project',
    friendlyTaskName: 'Project',
  };

  async run(): Promise<MetaTaskResult> {
    let result: ProjectMetaTaskResult = new ProjectMetaTaskResult(this.meta);
    let package_ = this.context.pkg;
    let repositoryInfo = await getRepositoryInfo(this.context.cliFlags.cwd);

    result.name = package_.name || '';
    result.version = package_.version || '';
    result.repository = repositoryInfo;
    result.filesForCheckup = this.context.paths;

    return result;
  }
}
