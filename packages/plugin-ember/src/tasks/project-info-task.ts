import { Task, TaskResult, getPackageJson } from '@checkup/core';

import { PackageJson } from 'type-fest';
import { ProjectInfoTaskResult } from '../results';
import { getProjectType } from '../utils/project';

export default class ProjectInfoTask implements Task {
  async run(): Promise<TaskResult> {
    let result: ProjectInfoTaskResult = new ProjectInfoTaskResult();
    let pkg: PackageJson = getPackageJson();

    result.type = getProjectType();
    result.name = pkg.name || '';
    result.version = pkg.version || '';

    return result;
  }
}
