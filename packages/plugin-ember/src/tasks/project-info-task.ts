import { BaseTask, TaskResult, getPackageJson } from '@checkup/core';

import { PackageJson } from 'type-fest';
import { ProjectInfoTaskResult } from '../results';
import { getProjectType } from '../utils/project';

export default class ProjectInfoTask extends BaseTask {
  static taskName: string = 'project-info';
  static friendlyTaskName: string = 'Project Information';

  async run(): Promise<TaskResult> {
    let result: ProjectInfoTaskResult = new ProjectInfoTaskResult();
    let pkg: PackageJson = getPackageJson(this.args.path);

    result.type = `Ember.js ${getProjectType(this.args.path)}`;
    result.name = pkg.name || '';
    result.version = pkg.version || '';

    return result;
  }
}
