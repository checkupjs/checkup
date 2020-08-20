import { ActionsEvaluator, TaskResult, TaskConfig } from '@checkup/core';

export function evaluateActions(taskResult: TaskResult, taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();
  let summaryResult = taskResult.result[0];
  let eslintDisableUsages = summaryResult.count;

  actionsEvaluator.add({
    name: 'reduce-eslint-disable-usages',
    summary: 'Reduce number of eslint-disable usages',
    details: `${eslintDisableUsages} usages of eslint-disable`,
    defaultThreshold: 2,
    items: [`Total eslint-disable usages: ${eslintDisableUsages}`],
    input: eslintDisableUsages,
  });

  return actionsEvaluator.evaluate(taskConfig);
}
