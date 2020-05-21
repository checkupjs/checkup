import {
  Category,
  Priority,
  Task,
  TaskContext,
  TaskResult,
  ESLintReport,
  Parser,
  BaseTask,
} from '@checkup/core';
import { EMBER_TEST_TYPES } from '../utils/lint-configs';
import { transformESLintReport } from '../utils/transformers';

import EmberTestTypesTaskResult from '../results/ember-test-types-task-result';

const micromatch = require('micromatch');

export default class EmberTestTypesTask extends BaseTask implements Task {
  meta = {
    taskName: 'ember-test-types',
    friendlyTaskName: 'Ember Test Types',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.Medium,
    },
  };
  private eslintParser: Parser<ESLintReport>;
  private testFiles: string[];

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    let createEslintParser = this.context.parsers.get('eslint')!;
    this.eslintParser = createEslintParser(EMBER_TEST_TYPES);

    this.testFiles = micromatch(this.context.paths, '**/*test.js');
  }

  async run(): Promise<TaskResult> {
    let result = new EmberTestTypesTaskResult(this.meta);

    let esLintReport = await this.runEsLint();

    this.debug('ESLint Report', esLintReport);
    result.testTypes = transformESLintReport(esLintReport);

    return result;
  }

  private async runEsLint(): Promise<ESLintReport> {
    return this.eslintParser.execute(this.testFiles);
  }
}
