import { ITask, ITaskResult } from '../types';

import { PackageJson } from 'type-fest';
import { ProjectInfoTaskResult } from '../results';
import { getPackageJson } from '../utils/get-package-json';
import { getProjectType } from '../utils/project';

export default class ProjectInfoTask implements ITask {
  async run(): Promise<ITaskResult> {
    let result: ProjectInfoTaskResult = new ProjectInfoTaskResult();
    let pkg: PackageJson = getPackageJson();

    result.type = getProjectType();
    result.name = pkg.name || '';
    result.version = pkg.version || '';

    return result;
  }
}
