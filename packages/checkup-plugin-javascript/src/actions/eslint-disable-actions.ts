import { ActionsEvaluator, TaskConfig } from '@checkup/core';
import { Result } from 'sarif';

export function evaluateActions(taskResults: Result[], taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();
  let eslintDisableUsages = taskResults.length;

  actionsEvaluator.add({
    taskName: 'eslint-disable',
    name: 'reduce-eslint-disable-usages',
    summary: 'Reduce number of eslint-disable usages',
    details: `${eslintDisableUsages} usages of eslint-disable`,
    defaultThreshold: 2,
    items: [`Total eslint-disable usages: ${eslintDisableUsages}`],
    input: eslintDisableUsages,
  });

  return actionsEvaluator.evaluate(taskConfig);
}
