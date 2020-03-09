import { BaseTask, Category, Priority, Task, TaskResult } from '@checkup/core';

import { EmberProjectTaskResult } from '../results';
import { getProjectType } from '../utils/project';

export default class EmberProjectTask extends BaseTask implements Task {
  meta = {
    taskName: 'ember-project',
    friendlyTaskName: 'Ember Project',
    taskClassification: {
      category: Category.Core,
      priority: Priority.Medium,
    },
  };

  async run(): Promise<TaskResult> {
    let result: EmberProjectTaskResult = new EmberProjectTaskResult(this.meta);

    result.type = `Ember.js ${getProjectType(this.args.path)}`;

    return result;
  }
}
