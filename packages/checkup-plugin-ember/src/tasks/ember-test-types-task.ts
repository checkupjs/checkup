import {
  Task,
  TaskContext,
  ESLintReport,
  Parser,
  BaseTask,
  buildLintResultDataItem,
  IndexableObject,
  buildMultiValueResult,
  TaskResult,
} from '@checkup/core';
import { EMBER_TEST_TYPES } from '../utils/lint-configs';

export default class EmberTestTypesTask extends BaseTask implements Task {
  taskName = 'ember-test-types';
  taskDisplayName = 'Test Types';
  category = 'testing';
  group = 'ember';

  private eslintParser: Parser<ESLintReport>;
  private testFiles: string[];

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let createEslintParser = this.context.parsers.get('eslint')!;
    this.eslintParser = createEslintParser(EMBER_TEST_TYPES);

    this.testFiles = this.context.paths.filterByGlob('**/*test.js');
  }

  async run(): Promise<TaskResult> {
    let esLintReport = await this.runEsLint();

    let multiValueResult = buildResult(esLintReport, this.context.cliFlags.cwd);

    return this.toJson(multiValueResult);
  }

  private async runEsLint(): Promise<ESLintReport> {
    return this.eslintParser.execute(this.testFiles);
  }
}

function buildResult(report: ESLintReport, cwd: string) {
  let resultData = report.results.reduce(
    (testTypes, lintResult) => {
      let testType: string = '';
      let method: string;

      if (lintResult.messages.length === 0) {
        return testTypes;
      }

      let messages = lintResult.messages
        .filter((message) => message.ruleId === 'test-types')
        .map((lintMessage) => {
          [testType, method] = lintMessage.message.split('|');

          return buildLintResultDataItem(lintMessage, cwd, lintResult.filePath, { method });
        });

      testTypes[testType].push(...messages);

      return testTypes;
    },
    {
      unit: [],
      rendering: [],
      application: [],
    } as IndexableObject
  );

  return Object.keys(resultData).map((key) => {
    return buildMultiValueResult(key, resultData[key], 'method', ['test', 'skip', 'only', 'todo']);
  });
}
