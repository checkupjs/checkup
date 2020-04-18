import { BaseTaskResult, TaskResult, ui, NumericalCardData } from '@checkup/core';
import { OutdatedDependencies } from '../tasks/outdated-dependencies-task';

export default class OutdatedDependenciesTaskResult extends BaseTaskResult implements TaskResult {
  outdatedDependencies!: OutdatedDependencies;
  versionTypes!: Map<string, Array<string[]>>;

  stdout() {
    ui.styledHeader(this.meta.friendlyTaskName);
    ui.blankLine();

    ui.styledHeader('Outdated Dependencies Overview');
    ui.styledObject({
      Major: this.versionTypes.get('major')?.length,
      Minor: this.versionTypes.get('minor')?.length,
      Patch: this.versionTypes.get('patch')?.length,
    });
    ui.blankLine();

    ui.styledHeader('Outdated Dependencies Details');
    this._writeFreshnessTable(this.outdatedDependencies);
    ui.blankLine();
  }

  json() {
    return {
      meta: this.meta,
      result: {
        outdatedDependencies: this.outdatedDependencies,
      },
    };
  }

  pdf() {
    return new NumericalCardData(this.meta, 22, 'this is a description of your result');
  }

  _writeFreshnessTable(dependencies: OutdatedDependencies) {
    if (dependencies.tableBody && dependencies.tableBody.length === 0) {
      return;
    }

    ui.table(this._transformToTableData(dependencies.tableBody), {
      package: {},
      current: {},
      wanted: {},
      latest: {},
      packageType: {},
      url: {},
    });
  }

  _transformToTableData(data: Array<String[]>) {
    let result: {
      package: String;
      current: String;
      wanted: String;
      latest: String;
      packageType: String;
      url: String;
    }[] = [];
    // Todo: should look into making it cleaner here
    data.forEach((dependency) => {
      const row = {
        package: dependency[0],
        current: dependency[1],
        wanted: dependency[2],
        latest: dependency[3],
        packageType: dependency[4],
        url: dependency[5],
      };
      result.push(row);
    });
    return result;
  }
}
