import {
  Task,
  ESLintReport,
  LintAnalyzer,
  BaseTask,
  NormalizedLintResult,
  sarifBuilder,
  lintBuilder,
  TaskContext,
  ESLintAnalyzer,
} from '@checkup/core';
import { Result } from 'sarif';
import { EMBER_TEST_TYPES } from '../utils/lint-configs';

export default class EmberTestTypesTask extends BaseTask implements Task {
  taskName = 'ember-test-types';
  taskDisplayName = 'Test Types';
  description = 'Gets a breakdown of all test types in an Ember.js project';
  category = 'testing';
  group = 'ember';

  private eslintAnalyzer: LintAnalyzer<ESLintReport>;
  private testFiles: string[];

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.eslintAnalyzer = new ESLintAnalyzer(EMBER_TEST_TYPES);

    this.testFiles = this.context.paths.filterByGlob('**/*test.js');
  }

  async run(): Promise<Result[]> {
    let esLintReport = await this.runEsLint();

    return this.buildResult(esLintReport, this.context.options.cwd);
  }

  private async runEsLint(): Promise<ESLintReport> {
    return this.eslintAnalyzer.analyze(this.testFiles);
  }

  buildResult(report: ESLintReport, cwd: string): Result[] {
    let testTypes: { [key: string]: NormalizedLintResult[] } = {};
    report.results.forEach((esLintResult) => {
      let testType: string = '';
      let method: string = '';

      if (esLintResult.messages.length === 0) {
        return;
      }

      esLintResult.messages
        .filter((message) => message.ruleId === 'test-types')
        .forEach((lintMessage) => {
          [testType, method] = lintMessage.message.split('|');
          lintMessage.message = testType;
          let lintResult = lintBuilder.toLintResult(lintMessage, cwd, esLintResult.filePath, {
            method,
          });
          let testCategory = `${testType}_${method}`;
          if (testTypes[testCategory] === undefined) {
            testTypes[testCategory] = [];
          }

          testTypes[testCategory].push(lintResult);
        });

      return testTypes;
    });

    return Object.keys(testTypes).flatMap((key) => {
      return sarifBuilder.fromLintResults(this, testTypes[key], {
        method: testTypes[key][0].method,
      });
    });
  }
}
