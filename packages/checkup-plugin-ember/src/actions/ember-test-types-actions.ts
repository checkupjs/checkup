import { ActionsEvaluator, toPercent, TaskConfig } from '@checkup/core';
import { Result } from 'sarif';

export function evaluateActions(taskResults: Result[], taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();

  let totalSkippedTests = taskResults
    .filter((taskResult) => taskResult.properties?.method === 'skip')
    .reduce((acc, filteredResult) => {
      return acc + (filteredResult?.occurrenceCount || 0);
    }, 0);

  let totalTests = taskResults.reduce(
    (total: number, result: Result) => total + (result?.occurrenceCount || 0),
    0
  );

  actionsEvaluator.add({
    name: 'reduce-skipped-tests',
    summary: 'Reduce number of skipped tests',
    details: `${toPercent(totalSkippedTests, totalTests)} of tests are skipped`,
    defaultThreshold: 0.01,

    items: [`Total skipped tests: ${totalSkippedTests}`],
    input: totalSkippedTests / totalTests,
  });

  return actionsEvaluator.evaluate(taskConfig);
}
