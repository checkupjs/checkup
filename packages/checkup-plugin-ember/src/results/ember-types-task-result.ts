import { BaseTaskResult, TaskItemData, TaskResult, ui } from '@checkup/core';

export default class EmberTypesTaskResult extends BaseTaskResult implements TaskResult {
  data!: {
    types: TaskItemData[];
  };

  process(data: { types: TaskItemData[] }) {
    this.data = data;
  }

  findByType(typeName: string): TaskItemData | undefined {
    return this.data.types.find((type) => type.type === typeName);
  }

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(this.data.types, { displayName: { header: 'Types' }, total: { header: 'Total' } });
    });
  }

  toJson() {
    return { meta: this.meta, result: { types: this.data.types } };
  }
}
