import {
  BaseTaskResult,
  ResultData,
  TaskResult,
  ui,
  ActionsEvaluator,
  Action2,
} from '@checkup/core';

export default class TemplateLintDisableTaskResult extends BaseTaskResult implements TaskResult {
  actions: Action2[] = [];

  data!: {
    templateLintDisables: ResultData;
  };

  process(data: { templateLintDisables: ResultData }) {
    this.data = data;

    let actionsEvaluator = new ActionsEvaluator();
    let templateLintDisableUsages = this.data.templateLintDisables.results.length;

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
    ui.log(`template-lint-disable Usages Found: ${this.data.templateLintDisables.results.length}`);
    ui.blankLine();
  }

  toJson() {
    return {
      meta: this.meta,
      result: {
        templateLintDisables: this.data.templateLintDisables.results,
        fileErrors: this.data.templateLintDisables.errors,
      },
    };
  }
}
