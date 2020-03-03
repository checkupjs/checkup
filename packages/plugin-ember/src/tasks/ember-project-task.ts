import {
  BaseTask,
  Category,
  Priority,
  TaskClassification,
  TaskName,
  TaskResult,
} from '@checkup/core';

import { EmberProjectTaskResult } from '../results';
import { getProjectType } from '../utils/project';

export default class EmberProjectTask extends BaseTask {
  taskName: TaskName = 'ember-project';
  friendlyTaskName: TaskName = 'Ember Project';
  taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.Medium,
  };

  async run(): Promise<TaskResult> {
    let result: EmberProjectTaskResult = new EmberProjectTaskResult(this);

    result.type = `Ember.js ${getProjectType(this.args.path)}`;

    return result;
  }
}
