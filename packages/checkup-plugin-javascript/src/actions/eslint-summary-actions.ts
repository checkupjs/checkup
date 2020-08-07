import { ActionsEvaluator, MultiValueResult, TaskResult, TaskConfig } from '@checkup/core';

export function evaluateActions(taskResult: TaskResult, taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();

  let errors = taskResult.result.find(
    (result: MultiValueResult) => result.key === 'eslint-errors'
  )!;
  let warnings = taskResult.result.find(
    (result: MultiValueResult) => result.key === 'eslint-warnings'
  )!;

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

  return actionsEvaluator.evaluate(taskConfig);
}
