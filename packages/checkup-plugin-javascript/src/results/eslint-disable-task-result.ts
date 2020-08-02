import {
  BaseTaskResult,
  ui,
  TaskResult,
  ActionsEvaluator,
  Action,
  SummaryResult,
} from '@checkup/core';

export default class EslintDisableTaskResult extends BaseTaskResult implements TaskResult {
  actions: Action[] = [];
  data: SummaryResult[] = [];

  process(data: SummaryResult[]) {
    this.data = data;

    let actionsEvaluator = new ActionsEvaluator();
    let summaryResult = this.data[0];
    let eslintDisableUsages = summaryResult.count;

    actionsEvaluator.add({
      name: 'reduce-eslint-disable-usages',
      summary: 'Reduce number of eslint-disable usages',
      details: `${eslintDisableUsages} usages of template-lint-disable`,
      defaultThreshold: 2,
      items: [`Total eslint-disable usages: ${eslintDisableUsages}`],
      input: eslintDisableUsages,
    });

    this.actions = actionsEvaluator.evaluate(this.config);
  }

  toConsole() {
    ui.log(`eslint-disable Usages Found: ${this.data[0].count}`);
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data,
    };
  }
}
