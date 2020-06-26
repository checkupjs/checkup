import { Task, TaskContext, TaskResult, ESLintReport, Parser, BaseTask } from '@checkup/core';
import { EMBER_TEST_TYPES } from '../utils/lint-configs';

import EmberTestTypesTaskResult from '../results/ember-test-types-task-result';

export default class EmberTestTypesTask extends BaseTask implements Task {
  meta = {
    taskName: 'ember-test-types',
    friendlyTaskName: 'Ember Test Types',
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

    this.debug('ESLint Report', esLintReport);

    result.process({ esLintReport });

    return result;
  }

  private async runEsLint(): Promise<ESLintReport> {
    return this.eslintParser.execute(this.testFiles);
  }
}
