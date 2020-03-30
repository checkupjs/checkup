import { BaseTaskResult, TaskResult, ui } from '@checkup/core';

export default class CheckupMetaTaskResult extends BaseTaskResult implements TaskResult {
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
      meta: this.meta,
      result: {
        checkup: {
          configHash: this.configHash,
          version: this.version,
        },
      },
    };
  }

  pdf() {
    return undefined;
  }
}
