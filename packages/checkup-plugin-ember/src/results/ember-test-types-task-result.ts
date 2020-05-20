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
    test: { minWidth: 8, header: 'test' },
  };

  let totalTodoCounts = getTotalOfType(testTypes, 'todo');
  let totalOnlyCounts = getTotalOfType(testTypes, 'only');
  let totalSkipCounts = getTotalOfType(testTypes, 'skip');

  if (totalOnlyCounts > 0) {
    tableColumns = { ...tableColumns, ...{ only: { minWidth: 8, header: 'only' } } };
  }
  if (totalTodoCounts > 0) {
    tableColumns = { ...tableColumns, ...{ todo: { minWidth: 8, header: 'todo' } } };
  }

  if (totalSkipCounts > 0) {
    tableColumns = {
      ...tableColumns,
      ...{ skip: { header: 'skip' }, percentageSkipped: { header: '' } },
    };
  }

  return tableColumns;
}

function getTotalOfType(array: any[], type: keyof any): number {
  return array.reduce((total, item) => {
    return total + item[type as keyof any];
  }, 0);
}
