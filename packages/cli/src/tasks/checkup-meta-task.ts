import * as crypto from 'crypto';
import * as stringify from 'json-stable-stringify';

import {
  BaseTask,
  Category,
  CheckupConfig,
  Priority,
  Task,
  TaskMetaData,
  TaskResult,
} from '@checkup/core';

import CheckupMetaTaskResult from '../results/checkup-meta-task-result';

const { version } = require('../../package.json');

function getConfigHash(checkupConfig: CheckupConfig) {
  let configAsJson = stringify(checkupConfig);

  return crypto
    .createHash('md5')
    .update(configAsJson)
    .digest('hex');
}

export default class CheckupMetaTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'checkup',
    friendlyTaskName: 'Checkup Configuration',
    taskClassification: {
      category: Category.Meta,
      priority: Priority.High,
    },
  };

  constructor(cliArguments: any, public checkupConfig: CheckupConfig) {
    super(cliArguments);
  }

  async run(): Promise<TaskResult> {
    let result: CheckupMetaTaskResult = new CheckupMetaTaskResult(this.meta);

    result.configHash = getConfigHash(this.checkupConfig);
    result.version = version;

    return result;
  }
}
