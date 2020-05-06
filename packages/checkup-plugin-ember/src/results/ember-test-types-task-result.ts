import { BaseTaskResult, TaskResult, ui } from '@checkup/core';
import { TestTypeInfo } from '../types';
export default class EmberTestTypesTaskResult extends BaseTaskResult implements TaskResult {
  testTypes!: TestTypeInfo[];

  toConsole() {
    let barColors = ['blue', 'green', 'yellow'];

    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(this.testTypes, deriveTableData(this.testTypes));

      ui.blankLine();

      ui.subHeader('Test Type Breakdown');

      ui.sectionedBar(
        this.testTypes.map((testType, index) => {
          return { title: testType.type, count: testType.total, color: barColors[index] };
        }),
        getTotalOfType(this.testTypes, 'total'),
        ' tests'
      );
    });
  }

  toJson() {
    return { meta: this.meta, result: { types: this.testTypes } };
  }
}

function deriveTableData(testTypes: TestTypeInfo[]): any {
  let tableColumns = {
    type: { minWidth: 15 },
    tests: { minWidth: 8 },
  };

  let totalTodoCounts = getTotalOfType(testTypes, 'todos');
  let totalOnlyCounts = getTotalOfType(testTypes, 'onlys');
  let totalSkipCounts = getTotalOfType(testTypes, 'skips');

  if (totalOnlyCounts > 0) {
    tableColumns = { ...tableColumns, ...{ onlys: { minWidth: 8 } } };
  }
  if (totalTodoCounts > 0) {
    tableColumns = { ...tableColumns, ...{ todos: { minWidth: 8 } } };
  }

  if (totalSkipCounts > 0) {
    tableColumns = { ...tableColumns, ...{ skips: {}, percentageSkipped: { header: '' } } };
  }

  return tableColumns;
}

function getTotalOfType(array: any[], type: keyof any): number {
  return array.reduce((total, item) => {
    return total + item[type as keyof any];
  }, 0);
}
