import {
  BaseTaskResult,
  ui,
  ResultData,
  TaskResult,
  ActionsEvaluator,
  Action2,
} from '@checkup/core';

export default class EslintDisableTaskResult extends BaseTaskResult implements TaskResult {
  actions: Action2[] = [];

  data!: {
    esLintDisables: ResultData;
  };

  process(data: { esLintDisables: ResultData }) {
    this.data = data;

    let actionsEvaluator = new ActionsEvaluator();
    let eslintDisableUsages = this.data.esLintDisables.results.length;

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
    ui.log(`eslint-disable Usages Found: ${this.data.esLintDisables.results.length}`);
  }

  toJson() {
    return {
      meta: this.meta,
      result: {
        eslintDisables: this.data.esLintDisables.results,
        fileErrors: this.data.esLintDisables.errors,
      },
    };
  }
}
