import {
  Task,
  TaskContext,
  TaskResult,
  ESLintReport,
  Parser,
  BaseTask,
  adaptResult,
  IndexableObject,
  buildMultiValueResult,
} from '@checkup/core';
import { EMBER_TEST_TYPES } from '../utils/lint-configs';

import EmberTestTypesTaskResult from '../results/ember-test-types-task-result';

export default class EmberTestTypesTask extends BaseTask implements Task {
  meta = {
    taskName: 'ember-test-types',
    friendlyTaskName: 'Test Types',
    taskClassification: {
      category: 'testing',
      group: 'ember',
    },
  };
  private eslintParser: Parser<ESLintReport>;
  private testFiles: string[];

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let createEslintParser = this.context.parsers.get('eslint')!;
    this.eslintParser = createEslintParser(EMBER_TEST_TYPES);

    this.testFiles = this.context.paths.filterByGlob('**/*test.js');
  }

  async run(): Promise<TaskResult> {
    let result = new EmberTestTypesTaskResult(this.meta, this.config);
    let esLintReport = await this.runEsLint();

    let multiValueResult = buildTestResult(esLintReport, this.context.cliFlags.cwd);

    result.process(multiValueResult);

    return result;
  }

  private async runEsLint(): Promise<ESLintReport> {
    return this.eslintParser.execute(this.testFiles);
  }
}

function buildTestResult(report: ESLintReport, cwd: string) {
  let transformedResults = report.results.reduce(
    (testTypes, lintResult) => {
      let testType: string = '';
      let method: string;

      if (lintResult.messages.length === 0) {
        return testTypes;
      }

      let messages = lintResult.messages.map((lintMessage) => {
        [testType, method] = lintMessage.message.split('|');

        return adaptResult(cwd, lintResult.filePath, lintMessage, { method });
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

  return Object.keys(transformedResults).map((key) => {
    return buildMultiValueResult(key, transformedResults[key], 'method', [
      'test',
      'skip',
      'only',
      'todo',
    ]);
  });
}
