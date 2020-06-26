import { BaseTaskResult, ui, ResultData, TaskResult, ActionList } from '@checkup/core';

export default class EslintDisableTaskResult extends BaseTaskResult implements TaskResult {
  actionList!: ActionList;

  data!: {
    esLintDisables: ResultData;
  };

  process(data: { esLintDisables: ResultData }) {
    this.data = data;

    this.actionList = new ActionList(
      [
        {
          name: 'num-eslint-disables',
          threshold: 2,
          value: this.data.esLintDisables.results.length,
          get enabled() {
            return this.value > this.threshold;
          },
          get message() {
            return `There are ${this.value} instances of 'eslint-disable', there should be at most ${this.threshold}.`;
          },
        },
      ],
      this.config
    );
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
