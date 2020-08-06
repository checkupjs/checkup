import { TaskResult, ActionsEvaluator } from '@checkup/core';

export function evaluateActions(taskResult: TaskResult) {
  let actionsEvaluator = new ActionsEvaluator();
  let summaryResult = taskResult.data[0];
  let eslintDisableUsages = summaryResult.count;

  actionsEvaluator.add({
    name: 'reduce-eslint-disable-usages',
    summary: 'Reduce number of eslint-disable usages',
    details: `${eslintDisableUsages} usages of template-lint-disable`,
    defaultThreshold: 2,
    items: [`Total eslint-disable usages: ${eslintDisableUsages}`],
    input: eslintDisableUsages,
  });

  return actionsEvaluator.evaluate(taskResult.config);
}
