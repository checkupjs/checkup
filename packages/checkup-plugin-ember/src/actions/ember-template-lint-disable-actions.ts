import { ActionsEvaluator, TaskConfig, sumOccurrences } from '@checkup/core';
import { Result } from 'sarif';

export function evaluateActions(taskResults: Result[], taskConfig: TaskConfig) {
  let actionsEvaluator = new ActionsEvaluator();
  let templateLintDisableUsages = sumOccurrences(taskResults);

  actionsEvaluator.add({
    taskName: 'ember-template-lint-disable',
    name: 'reduce-template-lint-disable-usages',
    summary: 'Reduce number of template-lint-disable usages',
    details: `${templateLintDisableUsages} usages of template-lint-disable`,
    defaultThreshold: 2,
    items: [`Total template-lint-disable usages: ${templateLintDisableUsages}`],
    input: templateLintDisableUsages,
  });

  return actionsEvaluator.evaluate(taskConfig);
}
