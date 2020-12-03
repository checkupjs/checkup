import { ActionsEvaluator, TaskConfig, sumOccurrences } from '@checkup/core';
import { Result } from 'sarif';

export function evaluateActions(taskResults: Result[], taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();

  let errors = taskResults.filter((result: Result) => result.properties?.type === 'error')!;
  let warnings = taskResults.filter((result: Result) => result.properties?.type === 'warning')!;

  let errorCount = sumOccurrences(errors);
  let warningCount = sumOccurrences(warnings);

  actionsEvaluator.add({
    name: 'reduce-template-lint-errors',
    summary: 'Reduce number of template-lint errors',
    details: `${errorCount} total errors`,
    defaultThreshold: 20,
    items: [`Total template-lint errors: ${errorCount}`],
    input: errorCount,
  });

  actionsEvaluator.add({
    name: 'reduce-template-lint-warnings',
    summary: 'Reduce number of template-lin warnings',
    details: `${warningCount} total warnings`,
    defaultThreshold: 20,
    items: [`Total template-lint warnings: ${warningCount}`],
    input: warningCount,
  });

  return actionsEvaluator.evaluate(taskConfig);
}
