import {
  BaseTaskResult,
  TaskResult,
  ActionsEvaluator,
  Action,
  MultiValueResult,
} from '@checkup/core';

export default class EslintSummaryTaskResult extends BaseTaskResult implements TaskResult {
  actions: Action[] = [];
  data: MultiValueResult[] = [];

  process(data: MultiValueResult[]) {
    this.data = data;

    let actionsEvaluator = new ActionsEvaluator();

    let errors = this.data.find((result) => result.key === 'eslint-errors')!;
    let warnings = this.data.find((result) => result.key === 'eslint-warnings')!;

    let errorCount = errors.dataSummary.total;
    let warningCount = warnings.dataSummary.total;

    actionsEvaluator.add({
      name: 'reduce-eslint-errors',
      summary: 'Reduce number of eslint errors',
      details: `${errorCount} total errors`,
      defaultThreshold: 20,
      items: [`Total eslint errors: ${errorCount}`],
      input: errorCount,
    });

    actionsEvaluator.add({
      name: 'reduce-eslint-warnings',
      summary: 'Reduce number of eslint warnings',
      details: `${warningCount} total warnings`,
      defaultThreshold: 20,
      items: [`Total eslint warnings: ${warningCount}`],
      input: warningCount,
    });

    this.actions = actionsEvaluator.evaluate(this.config);
  }
}
