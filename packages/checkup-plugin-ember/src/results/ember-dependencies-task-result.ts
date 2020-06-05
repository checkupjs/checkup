import {
  BaseTaskResult,
  TaskItemData,
  TaskMetaData,
  TaskResult,
  ui,
  ActionConfig,
} from '@checkup/core';

export default class EmberDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  dependencies: TaskItemData[];

  constructor(meta: TaskMetaData, config: ActionConfig[]) {
    super(meta, config);

    this.dependencies = [];
  }

  get hasDependencies() {
    return this.dependencies.some((dependency) => dependency.total > 0);
  }

  toConsole() {
    if (!this.hasDependencies) {
      return;
    }

    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(this.dependencies, {
        displayName: { header: 'Dependency Types' },
        total: { header: 'Total' },
      });
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: this.dependencies,
    };
  }
}
