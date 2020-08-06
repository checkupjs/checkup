import { BaseTaskResult, TaskResult, ActionsEvaluator, Action, SummaryResult } from '@checkup/core';

export default class EmberTemplateLintDisableTaskResult extends BaseTaskResult
  implements TaskResult {
  actions: Action[] = [];

  data: SummaryResult[] = [];

  process(data: SummaryResult[]) {
    this.data = data;

    let actionsEvaluator = new ActionsEvaluator();
    let summaryResult = this.data[0];
    let templateLintDisableUsages = summaryResult.count;

    actionsEvaluator.add({
      name: 'reduce-template-lint-disable-usages',
      summary: 'Reduce number of template-lint-disable usages',
      details: `${templateLintDisableUsages} usages of template-lint-disable`,
      defaultThreshold: 2,
      items: [`Total template-lint-disable usages: ${templateLintDisableUsages}`],
      input: templateLintDisableUsages,
    });

    this.actions = actionsEvaluator.evaluate(this.config);
  }
}
