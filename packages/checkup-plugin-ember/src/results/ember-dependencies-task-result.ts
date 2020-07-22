import { BaseTaskResult, TaskItemData, TaskResult, ui, toTaskItemData } from '@checkup/core';

export default class EmberDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  data!: {
    dependencies: TaskItemData[];
  };

  process(data: { dependencyResults: [string, Record<string, string>][] }) {
    this.data = {
      dependencies: data.dependencyResults.map(([type, data]) => {
        return toTaskItemData(type, data);
      }),
    };
  }

  get hasDependencies() {
    return this.data.dependencies.some((dependency) => dependency.total > 0);
  }

  toConsole() {
    if (!this.hasDependencies) {
      return;
    }

    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(this.data.dependencies, {
        displayName: { header: 'Dependency Types' },
        total: { header: 'Total' },
      });
    });
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data.dependencies,
    };
  }
}
