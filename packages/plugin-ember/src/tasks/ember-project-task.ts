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
  static taskName: TaskName = 'ember-project';
  static friendlyTaskName: TaskName = 'Ember Project';
  static taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.Medium,
  };

  async run(): Promise<TaskResult> {
    let result: EmberProjectTaskResult = new EmberProjectTaskResult();

    result.type = `Ember.js ${getProjectType(this.args.path)}`;

    return result;
  }
}
