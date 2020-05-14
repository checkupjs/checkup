import { BaseTaskResult, TableData, TaskResult, ui } from '@checkup/core';

import { OutdatedDependency } from '../tasks/outdated-dependencies-task';

export default class OutdatedDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  outdatedDependencies!: OutdatedDependency[];
  totalDependencies!: number;

  toConsole() {
    let versionTypes = groupByVersionType(this.outdatedDependencies);

    ui.section(this.meta.friendlyTaskName, () => {
      ui.sectionedBar(
        [
          { title: 'major', count: versionTypes.get('major')!.length, color: 'red' },
          { title: 'minor', count: versionTypes.get('minor')!.length, color: 'orange' },
          { title: 'patch', count: versionTypes.get('patch')!.length, color: 'yellow' },
        ],
        this.totalDependencies
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
