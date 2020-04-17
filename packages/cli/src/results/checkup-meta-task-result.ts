import BaseMetaTaskResult from '../base-meta-task-result';
import { MetaTaskResult } from '../types';
import { ui } from '@checkup/core';

export default class CheckupMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
  configHash!: string;
  version!: string;

  stdout() {
    ui.styledHeader(this.meta.friendlyTaskName);
    ui.styledObject({
      configHash: this.configHash,
      version: this.version,
    });
    ui.blankLine();
  }

  json() {
    return {
      checkup: {
        configHash: this.configHash,
        version: this.version,
      },
    };
  }
}
