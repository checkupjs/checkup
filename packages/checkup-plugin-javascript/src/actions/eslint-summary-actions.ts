import { ActionsEvaluator, TaskConfig } from '@checkup/core';
import { Result } from 'sarif';

export function evaluateActions(taskResults: Result[], taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();

  let errors = taskResults.filter((result: Result) => result.level === 'error')!;
  let warnings = taskResults.filter((result: Result) => result.level === 'warning')!;

  let errorCount = errors.length;
  let warningCount = warnings.length;

  actionsEvaluator.add({
    taskName: 'eslint-summary',
    name: 'reduce-eslint-errors',
    summary: 'Reduce number of eslint errors',
    details: `${errorCount} total errors`,
    defaultThreshold: 20,
    items: [`Total eslint errors: ${errorCount}`],
    input: errorCount,
  });

  actionsEvaluator.add({
    taskName: 'eslint-summary',
    name: 'reduce-eslint-warnings',
    summary: 'Reduce number of eslint warnings',
    details: `${warningCount} total warnings`,
    defaultThreshold: 20,
    items: [`Total eslint warnings: ${warningCount}`],
    input: warningCount,
  });

  return actionsEvaluator.evaluate(taskConfig);
}
