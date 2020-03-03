import {
  BaseTask,
  Category,
  Priority,
  TaskClassification,
  TaskName,
  TaskResult,
  getPackageJson,
} from '@checkup/core';

import ProjectInfoTaskResult from '../results/project-info-task-result';
import { getRepositoryInfo } from '../utils/repository';

export default class ProjectInfoTask extends BaseTask {
  taskName: TaskName = 'project-info';
  friendlyTaskName: TaskName = 'Project Information';
  taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.High,
  };

  async run(): Promise<TaskResult> {
    let result: ProjectInfoTaskResult = new ProjectInfoTaskResult(this);
    let package_ = getPackageJson(this.args.path);

    result.name = package_.name || '';
    result.version = package_.version || '';
    result.repository = await getRepositoryInfo(this.args.path);

    return result;
  }
}
