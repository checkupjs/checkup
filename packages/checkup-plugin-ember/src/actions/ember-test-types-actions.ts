import { ActionsEvaluator, toPercent, TaskConfig, sumOccurrences } from '@checkup/core';
import { Result } from 'sarif';

export function evaluateActions(taskResults: Result[], taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();

  let totalSkippedTests = sumOccurrences(
    taskResults.filter((taskResult) => taskResult.properties?.method === 'skip')
  );

  let totalTests = sumOccurrences(taskResults);

  actionsEvaluator.add({
    taskName: 'ember-test-types',
    name: 'reduce-skipped-tests',
    summary: 'Reduce number of skipped tests',
    details: `${toPercent(totalSkippedTests, totalTests)} of tests are skipped`,
    defaultThreshold: 0.01,

    items: [`Total skipped tests: ${totalSkippedTests}`],
    input: totalSkippedTests / totalTests,
  });

  return actionsEvaluator.evaluate(taskConfig);
}
