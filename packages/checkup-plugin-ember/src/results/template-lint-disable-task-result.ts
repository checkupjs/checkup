import { BaseTaskResult, ResultData, TaskResult, ui, ActionList } from '@checkup/core';

export default class TemplateLintDisableTaskResult extends BaseTaskResult implements TaskResult {
  data!: {
    templateLintDisables: ResultData;
  };

  process(data: { templateLintDisables: ResultData }) {
    this.data = data;
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

  get actionList() {
    return new ActionList(
      [
        {
          name: 'num-template-lint-disables',
          threshold: 2,
          value: this.data.templateLintDisables.results.length,
          get enabled() {
            return this.value > this.threshold;
          },
          get message() {
            return `There are ${this.value} instances of 'template-lint-disable', there should be at most ${this.threshold}.`;
          },
        },
      ],
      this.config
    );
  }
}
