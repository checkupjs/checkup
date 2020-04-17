import { BaseTask, getPackageJson } from '@checkup/core';
import { MetaTask, MetaTaskResult, TaskIdentifier } from '../types';

import ProjectMetaTaskResult from '../results/project-meta-task-result';
import { getRepositoryInfo } from '../helpers/repository';

export default class ProjectMetaTask extends BaseTask implements MetaTask {
  meta: TaskIdentifier = {
    taskName: 'project',
    friendlyTaskName: 'Project',
  };

  async run(): Promise<MetaTaskResult> {
    let result: ProjectMetaTaskResult = new ProjectMetaTaskResult(this.meta);
    let package_ = getPackageJson(this.args.path);

    result.name = package_.name || '';
    result.version = package_.version || '';
    result.repository = await getRepositoryInfo(this.args.path);

    return result;
  }
}
