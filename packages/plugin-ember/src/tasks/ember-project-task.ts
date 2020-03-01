import { BaseTask, TaskName, TaskResult } from '@checkup/core';

import { EmberProjectTaskResult } from '../results';
import { getProjectType } from '../utils/project';

export default class EmberProjectTask extends BaseTask {
  static taskName: TaskName = 'ember-project';
  static friendlyTaskName: TaskName = 'Ember Project';

  async run(): Promise<TaskResult> {
    let result: EmberProjectTaskResult = new EmberProjectTaskResult();

    result.type = `Ember.js ${getProjectType(this.args.path)}`;

    return result;
  }
}
