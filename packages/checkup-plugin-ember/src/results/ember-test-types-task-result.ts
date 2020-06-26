import {
  BaseTaskResult,
  TaskResult,
  ui,
  ESLintReport,
  ActionsEvaluator,
  Action2,
  toPercent,
} from '@checkup/core';
import { TestTypeInfo } from '../types';
import { transformESLintReport } from '../utils/transformers';

export default class EmberTestTypesTaskResult extends BaseTaskResult implements TaskResult {
  actions: Action2[] = [];

  data!: {
    testTypes: TestTypeInfo[];
  };

  process(data: { esLintReport: ESLintReport }) {
    this.data = {
      testTypes: transformESLintReport(data.esLintReport),
    };

    let actionsEvaluator = new ActionsEvaluator();
    let totalSkippedTests = this.sumByType('skip');
    let totalTests = this.sumByType('total');

    actionsEvaluator.add({
      name: 'reduce-skipped-tests',
      summary: 'Reduce number of skipped tests',
      details: `${toPercent(totalSkippedTests, totalTests)} of tests are skipped`,
      defaultThreshold: 0.01,

      items: [`Total skipped tests: ${totalSkippedTests}`],
      input: totalSkippedTests / totalTests,
    });

    this.actions = actionsEvaluator.evaluate(this.config);
  }

  toConsole() {
    let barColors = ['blue', 'cyan', 'green'];

    ui.section(this.meta.friendlyTaskName, () => {
      ui.table(
        this.data.testTypes.map((testTypeInfo) => {
          return {
            ...testTypeInfo,
            ...{
              skipInfo: `${testTypeInfo.skip} ${
                testTypeInfo.skip > 0
                  ? `(${toPercent(testTypeInfo.skip, testTypeInfo.test + testTypeInfo.skip)})`
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
        this.data.testTypes.map((testType, index) => {
          return {
            title: testType.type,
            count: testType.total,
            color: barColors[index],
          };
        }),
        this.sumByType('total'),
        ' tests'
      );
    });
  }

  toJson() {
    return { meta: this.meta, result: { types: this.data.testTypes } };
  }

  get tableColumns() {
    let columns = {
      type: { minWidth: 15 },
      test: { minWidth: 8, header: 'test' },
    };

    if (this.sumByType('only') > 0) {
      columns = { ...columns, ...{ only: { minWidth: 8, header: 'only' } } };
    }
    if (this.sumByType('todo') > 0) {
      columns = { ...columns, ...{ todo: { minWidth: 8, header: 'todo' } } };
    }

    if (this.sumByType('skip') > 0) {
      columns = { ...columns, ...{ skipInfo: { header: 'skip' } } };
    }

    return columns;
  }

  private sumByType(prop: keyof Omit<TestTypeInfo, 'type'>): number {
    return this.data.testTypes.reduce((total, item) => {
      return total + item[prop];
    }, 0);
  }
}
