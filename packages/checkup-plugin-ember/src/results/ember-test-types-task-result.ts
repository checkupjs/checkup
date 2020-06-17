import {
  ActionList,
  BaseTaskResult,
  TaskResult,
  fractionToPercent,
  decimalToPercent,
  ui,
} from '@checkup/core';
import { TestTypeInfo, TestType } from '../types';

export default class EmberTestTypesTaskResult extends BaseTaskResult implements TaskResult {
  testTypes!: TestTypeInfo[];

  toConsole() {
    let barColors = ['blue', 'cyan', 'green'];

    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(
        this.testTypes.map((testTypeInfo) => {
          return {
            ...testTypeInfo,
            ...{
              skipInfo: `${testTypeInfo.skip} ${
                testTypeInfo.skip > 0
                  ? `(${fractionToPercent(
                      testTypeInfo.skip,
                      testTypeInfo.test + testTypeInfo.skip
                    )})`
                  : ''
              }`,
            },
          };
        }),
        this.tableColumns
      );

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

  get totalSkips() {
    return getTotalOfType(this.testTypes, 'skip');
  }

  get totalOnlys() {
    return getTotalOfType(this.testTypes, 'only');
  }

  get totalTodos() {
    return getTotalOfType(this.testTypes, 'todo');
  }

  get tableColumns() {
    let columns = {
      type: { minWidth: 15 },
      test: { minWidth: 8, header: 'test' },
    };

    if (this.totalOnlys > 0) {
      columns = { ...columns, ...{ only: { minWidth: 8, header: 'only' } } };
    }
    if (this.totalTodos > 0) {
      columns = { ...columns, ...{ todo: { minWidth: 8, header: 'todo' } } };
    }

    if (this.totalSkips > 0) {
      columns = { ...columns, ...{ skipInfo: { header: 'skip' } } };
    }

    return columns;
  }

  get actionList() {
    let totalTests = getTotalOfType(this.testTypes, 'total');
    let totalSkips = this.totalSkips;

    let totalRenderingUnit = this.testTypes.reduce((total, item: TestTypeInfo) => {
      if (item.type === TestType.Rendering || item.type === TestType.Unit) {
        return total + item.total;
      }
      return total;
    }, 0);
    let totalApplication =
      this.testTypes.find((testType) => testType.type === TestType.Application).total || 0;

    return new ActionList(
      [
        {
          name: 'percentage-skipped-tests',
          threshold: 0.01,
          value: this.totalSkips / totalTests,
          get enabled() {
            return this.value > this.threshold;
          },
          get message() {
            return `${fractionToPercent(
              totalSkips,
              totalTests
            )} of your tests are skipped, this value should be below ${decimalToPercent(
              this.threshold
            )}`;
          },
        },
        {
          name: 'ratio-application-tests',
          threshold: 1,
          value: totalRenderingUnit / totalApplication,
          get enabled() {
            return this.threshold > this.value;
          },
          get message() {
            return `You have too many application tests. The number of unit tests and rendering tests combined should be at least ${
              this.threshold > 1 ? `${this.threshold}x ` : ''
            }greater than the number of application tests.`;
          },
        },
      ],
      this.config
    );
  }
}

function getTotalOfType(array: any[], type: keyof any): number {
  return array.reduce((total, item) => {
    return total + item[type as keyof any];
  }, 0);
}
