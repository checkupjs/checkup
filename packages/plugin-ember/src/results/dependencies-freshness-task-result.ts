import { BaseTaskResult, TaskResult, ui } from '@checkup/core';
import { DepFreshnessInfo } from '../types';

export default class DependenciesFreshnessTaskResult extends BaseTaskResult implements TaskResult {
  depFreshnessInfo!: DepFreshnessInfo;

  stdout() {
    ui.styledHeader(this.meta.taskName);
    ui.blankLine();

    this._writeFreshnessTable(this.depFreshnessInfo);
    ui.blankLine();
    // Todo: should look into color schemes
  }

  json() {
    return {
      meta: this.meta,
      result: {
        depFreshnessInfo: this.depFreshnessInfo,
      },
    };
  }

  pdf() {
    return undefined;
  }

  _writeFreshnessTable(dependencies: DepFreshnessInfo) {
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
    data.forEach(dependency => {
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
