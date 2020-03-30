import {
  BaseTask,
  Category,
  Priority,
  Task,
  TaskMetaData,
  TaskResult,
  getPackageJson,
} from '@checkup/core';

import ProjectMetaTaskResult from '../results/project-meta-task-result';
import { getRepositoryInfo } from '../helpers/repository';

export default class ProjectMetaTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'project',
    friendlyTaskName: 'Project',
    taskClassification: {
      category: Category.Meta,
      priority: Priority.High,
    },
  };

  async run(): Promise<TaskResult> {
    let result: ProjectMetaTaskResult = new ProjectMetaTaskResult(this.meta);
    let package_ = getPackageJson(this.args.path);

    result.name = package_.name || '';
    result.version = package_.version || '';
    result.repository = await getRepositoryInfo(this.args.path);

    return result;
  }
}
