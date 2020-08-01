import {
  BaseTaskResult,
  TaskResult,
  ui,
  ActionsEvaluator,
  Action,
  SummaryResult,
} from '@checkup/core';

export default class TemplateLintDisableTaskResult extends BaseTaskResult implements TaskResult {
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

  toConsole() {
    ui.log(`template-lint-disable Usages Found: ${this.data[0].count}`);
    ui.blankLine();
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data,
    };
  }
}
