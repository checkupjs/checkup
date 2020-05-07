import { BaseTaskResult, TableData, TaskResult, ui } from '@checkup/core';

import { OutdatedDependency } from '../tasks/outdated-dependencies-task';

export default class OutdatedDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  versionTypes!: Map<string, Array<OutdatedDependency>>;
  dependencies!: OutdatedDependency[];

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.styledObject({
        Major: this.versionTypes.get('major')?.length,
        Minor: this.versionTypes.get('minor')?.length,
        Patch: this.versionTypes.get('patch')?.length,
      });
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: {
        dependencies: this.versionTypes,
      },
    };
  }

  toReportData() {
    return [
      new TableData(
        this.meta,
        this.dependencies.map((dependency) => ({
          name: dependency.moduleName,
          value: dependency.installed,
        }))
      ),
    ];
  }

  _writeToTable(dependencies: OutdatedDependency[]) {
    ui.table(dependencies, {
      package: {},
      current: {},
      wanted: {},
      latest: {},
      packageType: {},
      url: {},
    });
  }
}
