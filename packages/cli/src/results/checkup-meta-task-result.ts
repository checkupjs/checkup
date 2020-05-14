import { MetaTaskResult, OutputPosition } from '../types';

import BaseMetaTaskResult from '../base-meta-task-result';
import { ui } from '@checkup/core';

export default class CheckupMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
  outputPosition: OutputPosition = OutputPosition.Footer;
  configHash!: string;
  version!: string;

  toConsole() {
    ui.dimmed(`checkup v${this.version}`);
    ui.dimmed(`config ${this.configHash}`);
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
