import {
  BaseTask,
  Category,
  Priority,
  Task,
  TaskMetaData,
  TaskResult,
  getPackageJson,
} from '@checkup/core';

import ProjectInfoTaskResult from '../results/project-info-task-result';
import { getRepositoryInfo } from '../utils/repository';

export default class ProjectInfoTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'project-info',
    friendlyTaskName: 'Project Information',
    taskClassification: {
      category: Category.Core,
      priority: Priority.High,
    },
  };

  async run(): Promise<TaskResult> {
    let result: ProjectInfoTaskResult = new ProjectInfoTaskResult(this.meta);
    let package_ = getPackageJson(this.args.path);

    result.name = package_.name || '';
    result.version = package_.version || '';
    result.repository = await getRepositoryInfo(this.args.path);

    return result;
  }
}
