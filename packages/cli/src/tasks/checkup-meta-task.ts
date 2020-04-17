import * as crypto from 'crypto';
import * as stringify from 'json-stable-stringify';

import { BaseTask, CheckupConfig } from '@checkup/core';
import { MetaTask, MetaTaskResult, TaskIdentifier } from '../types';

import CheckupMetaTaskResult from '../results/checkup-meta-task-result';
import { getVersion } from '../helpers/get-version';

function getConfigHash(checkupConfig: CheckupConfig) {
  let configAsJson = stringify(checkupConfig);

  return crypto.createHash('md5').update(configAsJson).digest('hex');
}

export default class CheckupMetaTask extends BaseTask implements MetaTask {
  meta: TaskIdentifier = {
    taskName: 'checkup',
    friendlyTaskName: 'Checkup Configuration',
  };

  constructor(cliArguments: any, public checkupConfig: CheckupConfig) {
    super(cliArguments);
  }

  async run(): Promise<MetaTaskResult> {
    let result: CheckupMetaTaskResult = new CheckupMetaTaskResult(this.meta);

    result.configHash = getConfigHash(this.checkupConfig);
    result.version = getVersion();

    return result;
  }
}
