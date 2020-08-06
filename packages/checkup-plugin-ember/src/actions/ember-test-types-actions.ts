import { TaskResult, ActionsEvaluator, MultiValueResult, toPercent } from '@checkup/core';

export function evaluateActions(taskResult: TaskResult) {
  let actionsEvaluator = new ActionsEvaluator();
  let totalSkippedTests = taskResult.data.reduce(
    (total: number, result: MultiValueResult) => total + result.dataSummary.values.skip,
    0
  );
  let totalTests = taskResult.data.reduce(
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

  return actionsEvaluator.evaluate(taskResult.config);
}
