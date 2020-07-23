import { BaseTaskResult, TaskResult, ui, SummaryResult } from '@checkup/core';

export default class EmberDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  data!: SummaryResult[];

  process(data: SummaryResult[]) {
    this.data = data;
  }

  get hasDependencies() {
    return this.data.some((dependency) => dependency.count > 0);
  }

  toConsole() {
    if (!this.hasDependencies) {
      return;
    }

    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(
        this.data.map((dependencyGroup) => {
          return {
            key: dependencyGroup.key,
            count: dependencyGroup.count,
          };
        }),
        {
          key: { header: 'Dependency Groups' },
          count: { header: 'Count' },
        }
      );
    });
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data,
    };
  }
}
