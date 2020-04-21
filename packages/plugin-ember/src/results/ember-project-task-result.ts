import { BaseTaskResult, TaskResult, ui, NumericalCardData } from '@checkup/core';

export default class EmberProjectTaskResult extends BaseTaskResult implements TaskResult {
  type!: string;
  name!: string;
  version!: string;

  stdout() {
    ui.styledHeader(this.meta.friendlyTaskName);
    ui.blankLine();
    ui.styledObject({
      type: this.type,
    });
    ui.blankLine();
  }

  json() {
    return { meta: this.meta, result: { type: this.type } };
  }

  pdf() {
    // TODO: add in correct data type for EmberProjectTaskResult
    return [new NumericalCardData(this.meta, 22, 'this is a description of your result')];
  }
}
