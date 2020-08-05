import { BaseTaskResult, TaskResult, ui, MultiValueResult } from '@checkup/core';

export default class OctaneMigrationStatusTaskResult extends BaseTaskResult implements TaskResult {
  data: MultiValueResult[] = [];

  process(data: MultiValueResult[]) {
    this.data = data;
  }

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.log(
        `${ui.emphasize('Octane Violations')}: ${this.data.reduce((violationsCount, result) => {
          return violationsCount + result.dataSummary.total;
        }, 0)}`
      );
      ui.blankLine();
      this.data.forEach(({ key, dataSummary }) => {
        ui.subHeader(key);
        ui.valuesList(
          Object.entries(dataSummary.values).map(([key, count]) => {
            return { title: key, count };
          }),
          'violations'
        );
        ui.blankLine();
      });
    });
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data,
    };
  }
}
