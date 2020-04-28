import BaseMetaTaskResult from '../base-meta-task-result';
import { MetaTaskResult } from '../types';
import { ui } from '@checkup/core';

export default class CheckupMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
  configHash!: string;
  version!: string;

  toConsole() {
    ui.dimmed(`Generated using Checkup v${this.version}. Config: ${this.configHash}`);
    ui.blankLine();
  }

  toJson() {
    return {
      checkup: {
        configHash: this.configHash,
        version: this.version,
      },
    };
  }
}
