import {
  BaseTaskResult,
  TaskResult,
  ESLintReport,
  ActionsEvaluator,
  Action,
  toPercent,
  MultiValueResult,
  ui,
  TaskMetaData,
  TaskConfig,
} from '@checkup/core';
import { buildTestResult } from '../utils/transformers';

export default class EmberTestTypesTaskResult extends BaseTaskResult implements TaskResult {
  actions: Action[] = [];
  data: MultiValueResult[] = [];
  rawData: [] = [];
  cwd: string;

  constructor(meta: TaskMetaData, config: TaskConfig, cwd: string) {
    super(meta, config);

    this.cwd = cwd;
  }

  process(data: { esLintReport: ESLintReport }) {
    this.data = buildTestResult(data.esLintReport, this.cwd);
    this.rawData = this.data.flatMap((datum) => datum.data) as [];

    let actionsEvaluator = new ActionsEvaluator();
    let totalSkippedTests = this.data.reduce(
      (total, result) => total + result.percent.values.skip,
      0
    );
    let totalTests = this.data.reduce((total, result) => total + result.percent.total, 0);

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
      this.data.forEach((testTypeInfo) => {
        ui.subHeader(testTypeInfo.key);
        ui.table(
          Object.entries(testTypeInfo.percent.values).map(([key, count]) => {
            return { [testTypeInfo.percent.dataKey]: key, count };
          }),
          {
            [testTypeInfo.percent.dataKey]: {},
            count: {},
          }
        );
        ui.blankLine();
      });

      ui.subHeader('tests by type');
      ui.sectionedBar(
        this.data.map((testType, index) => {
          return {
            title: testType.key,
            count: testType.percent.total,
            color: barColors[index],
          };
        }),
        this.data.reduce((total, result) => total + result.percent.total, 0),
        ' tests'
      );
    });
  }

  toJson() {
    return { info: this.meta, result: this.data };
  }
}
