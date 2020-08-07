import { ActionsEvaluator, TaskResult, TaskConfig } from '@checkup/core';

export function evaluateActions(taskResult: TaskResult, taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();
  let summaryResult = taskResult.result[0];
  let templateLintDisableUsages = summaryResult.count;

  actionsEvaluator.add({
    name: 'reduce-template-lint-disable-usages',
    summary: 'Reduce number of template-lint-disable usages',
    details: `${templateLintDisableUsages} usages of template-lint-disable`,
    defaultThreshold: 2,
    items: [`Total template-lint-disable usages: ${templateLintDisableUsages}`],
    input: templateLintDisableUsages,
  });

  return actionsEvaluator.evaluate(taskConfig);
}
