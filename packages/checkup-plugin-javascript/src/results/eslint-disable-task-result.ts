import {
  BaseTaskResult,
  ui,
  ResultData,
  TaskResult,
  TaskMetaData,
  ActionList,
  ActionConfig,
} from '@checkup/core';

export default class EslintDisableTaskResult extends BaseTaskResult implements TaskResult {
  actionList: ActionList;

  constructor(meta: TaskMetaData, config: ActionConfig[], public eslintDisables: ResultData) {
    super(meta, config);

    this.actionList = new ActionList(
      [
        {
          key: 'numEslintDisables',
          isEnabled: function () {
            return this.value > this.threshold;
          },
          threshold: 2,
          value: eslintDisables.results.length,
          message: function () {
            return `There should be no more than ${this.threshold} instances of 'eslint-disable', and you have ${this.value} instances.`;
          },
          enabledByDefault: false,
        },
      ],
      config
    );
  }

  toConsole() {
    ui.log(`eslint-disable Usages Found: ${this.eslintDisables.results.length}`);
  }

  toJson() {
    return {
      meta: this.meta,
      result: {
        eslintDisables: this.eslintDisables.results,
        fileErrors: this.eslintDisables.errors,
      },
    };
  }
}
