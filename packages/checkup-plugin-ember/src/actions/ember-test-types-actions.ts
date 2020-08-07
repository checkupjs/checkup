import {
  ActionsEvaluator,
  MultiValueResult,
  toPercent,
  TaskResult,
  TaskConfig,
} from '@checkup/core';

export function evaluateActions(taskResult: TaskResult, taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();
  let totalSkippedTests = taskResult.result.reduce(
    (total: number, result: MultiValueResult) => total + result.dataSummary.values.skip,
    0
  );
  let totalTests = taskResult.result.reduce(
    (total: number, result: MultiValueResult) => total + result.dataSummary.total,
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
