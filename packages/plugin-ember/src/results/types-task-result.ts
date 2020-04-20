import { BaseTaskResult, TaskItemData, TaskResult, ui, NumericalCardData } from '@checkup/core';

export default class TypesTaskResult extends BaseTaskResult implements TaskResult {
  types!: TaskItemData[];

  findByType(typeName: string): TaskItemData | undefined {
    return this.types.find((type) => type.type === typeName);
  }

  stdout() {
    ui.styledHeader(this.meta.friendlyTaskName);
    ui.blankLine();
    ui.table(this.types, { type: {}, total: {} });
    ui.blankLine();
  }

  json() {
    return { meta: this.meta, result: { types: this.types } };
  }

  pdf() {
    // TODO: add in correct data type for TypesTaskResult
    return [new NumericalCardData(this.meta, 22, 'this is a description of your result')];
  }
}
