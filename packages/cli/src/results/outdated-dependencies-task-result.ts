import { BaseTaskResult, TableData, TaskResult, ui } from '@checkup/core';

import { OutdatedDependency } from '../tasks/outdated-dependencies-task';

export default class OutdatedDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  dependencies!: OutdatedDependency[];

  toConsole() {
    let versionTypes = groupByVersionType(this.dependencies);

    ui.section(this.meta.friendlyTaskName, () => {
      ui.styledObject({
        Major: versionTypes.get('major')!.length,
        Minor: versionTypes.get('minor')!.length,
        Patch: versionTypes.get('patch')!.length,
      });
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: {
        dependencies: this.dependencies,
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

function groupByVersionType(dependencies: OutdatedDependency[]) {
  let versionTypes: Map<string, Array<OutdatedDependency>> = new Map<
    string,
    Array<OutdatedDependency>
  >([
    ['major', []],
    ['minor', []],
    ['patch', []],
  ]);

  for (let dependency of dependencies) {
    try {
      // for catching when dependency version is 'exotic', which means yarn cannot detect for you whether the package has become outdated
      versionTypes.get(dependency.bump)?.push(dependency);
    } catch (error) {
      // do nothing
    }
  }

  return versionTypes;
}
