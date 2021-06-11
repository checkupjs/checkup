import { ActionsEvaluator, toPercent, TaskConfig } from '@checkup/core';
import { Result } from 'sarif';

export function evaluateActions(taskResults: Result[], taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();

  let totalSkippedTests = taskResults.filter(
    (taskResult) => taskResult.properties?.testMethod === 'skip'
  ).length;
  let totalTests = taskResults.length;

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
