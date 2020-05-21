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

    result.name = package_.name || '';
    result.version = package_.version || '';
    result.repository = await getRepositoryInfo(this.context.cliFlags.cwd);

    return result;
  }
}
