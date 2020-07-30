import { BaseTaskResult, TaskResult, ui, LookupValueResult } from '@checkup/core';

export default class LinesOfCodeTaskResult extends BaseTaskResult implements TaskResult {
  data!: LookupValueResult[];

  process(data: LookupValueResult[]) {
    this.data = data;
  }

  toConsole() {
    let { dataSummary } = this.data[0];
    ui.section(this.meta.friendlyTaskName, () => {
      // ui.table(
      //   Object.entries(dataSummary.values).map(([key, count]) => {
      //     return { [dataSummary.dataKey]: key, [dataSummary.valueKey]: count };
      //   }),
      //   {
      //     [dataSummary.dataKey]: {},
      //     [dataSummary.valueKey]: {},
      //   }
      // );

      ui.sectionedBar(
        Object.entries(dataSummary.values).map(([key, count]) => {
          return { title: key, count, color: ui.randomColor() };
        }),
        dataSummary.total,
        'files'
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
