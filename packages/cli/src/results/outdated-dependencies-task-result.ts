import { BaseTaskResult, TableData, TaskResult, ui } from '@checkup/core';

import { OutdatedDependency } from '../tasks/outdated-dependencies-task';

export default class OutdatedDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  outdatedDependencies!: OutdatedDependency[];
  totalDependencies!: number;

  toConsole() {
    let versionTypes = groupByVersionType(this.outdatedDependencies);

    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(
        [
          getTableItem('major', versionTypes.get('major')!.length, this.totalDependencies),
          getTableItem('minor', versionTypes.get('minor')!.length, this.totalDependencies),
          getTableItem('patch', versionTypes.get('patch')!.length, this.totalDependencies),
        ],
        {
          type: { minWidth: 10 },
          outdatedOfTotal: { header: 'Outdated/Total' },
        }
      );
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: {
        dependencies: this.outdatedDependencies,
      },
    };
  }

  toReportData() {
    return [
      new TableData(
        this.meta,
        this.outdatedDependencies.map((dependency) => ({
          name: dependency.moduleName,
          value: dependency.installed,
        }))
      ),
    ];
  }
}

function getTableItem(type: string, outdated: number, total: number) {
  return {
    type: type,
    outdatedOfTotal: `${outdated}/${total}`,
  };
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
