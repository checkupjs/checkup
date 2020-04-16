import { BaseTaskResult, TaskResult, ui, NumericalCardData } from '@checkup/core';

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
      checkup: {
        configHash: this.configHash,
        version: this.version,
      },
    };
  }

  pdf() {
    // TODO: add in correct data type for CheckupMetaTaskResult
    return new NumericalCardData(this.meta, 22, 'this is a description of your result');
  }
}
