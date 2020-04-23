import { BaseTaskResult, TaskResult, ui, TableData } from '@checkup/core';

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

  html() {
    return [new TableData(this.meta, [{ name: 'type', value: this.type }])];
  }
}
