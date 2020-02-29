import { BaseTask, TaskName, TaskResult, getPackageJson } from '@checkup/core';

import { PackageJson } from 'type-fest';
import ProjectInfoTaskResult from '../results/project-info-task-result';
import { getRepositoryInfo } from '../utils/repository';

export default class ProjectInfoTask extends BaseTask {
  static taskName: TaskName = 'project-info';
  static friendlyTaskName: TaskName = 'Project Information';

  async run(): Promise<TaskResult> {
    let result: ProjectInfoTaskResult = new ProjectInfoTaskResult();
    let pkg: PackageJson = getPackageJson(this.args.path);

    result.name = pkg.name || '';
    result.version = pkg.version || '';
    result.repository = await getRepositoryInfo(this.args.path);

    return result;
  }
}
