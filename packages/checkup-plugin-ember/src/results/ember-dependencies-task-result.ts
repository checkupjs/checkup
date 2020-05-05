import {
  BaseTaskResult,
  TableData,
  TaskItemData,
  TaskMetaData,
  TaskResult,
  ui,
} from '@checkup/core';

export default class EmberDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  dependencies: TaskItemData[];

  constructor(meta: TaskMetaData) {
    super(meta);

    this.dependencies = [];
  }

  get hasDependencies() {
    return this.dependencies.some((dependency) => dependency.total > 0);
  }

  toConsole() {
    if (!this.hasDependencies) {
      return;
    }

    ui.section(this.meta.taskName, () => {
      ui.table(this.dependencies, { type: {}, total: {} });
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: this.dependencies,
    };
  }

  toReportData() {
    return [
      new TableData(
        this.meta,
        this.dependencies.map((dependency) => ({
          name: dependency.type,
          value: dependency.total,
        }))
      ),
    ];
  }
}
