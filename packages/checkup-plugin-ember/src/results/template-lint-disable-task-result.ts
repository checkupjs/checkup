import { BaseTaskResult, ResultData, TaskResult, ui, ActionList } from '@checkup/core';

export default class TemplateLintDisableTaskResult extends BaseTaskResult implements TaskResult {
  templateLintDisables!: ResultData;

  toConsole() {
    ui.log(`template-lint-disable Usages Found: ${this.templateLintDisables.results.length}`);
    ui.blankLine();
  }

  toJson() {
    return {
      meta: this.meta,
      result: {
        templateLintDisables: this.templateLintDisables.results,
        fileErrors: this.templateLintDisables.errors,
      },
    };
  }

  get actionList() {
    return new ActionList(
      [
        {
          name: 'numTemplateLintDisables',
          threshold: 2,
          value: this.templateLintDisables.results.length,
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
