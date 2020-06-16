import {
  BaseTaskResult,
  ui,
  ResultData,
  TaskResult,
  TaskMetaData,
  ActionList,
  TaskConfig,
} from '@checkup/core';

export default class EslintDisableTaskResult extends BaseTaskResult implements TaskResult {
  actionList: ActionList;

  constructor(meta: TaskMetaData, config: TaskConfig, public eslintDisables: ResultData) {
    super(meta, config);

    this.actionList = new ActionList(
      [
        {
          name: 'numEslintDisables',
          threshold: 2,
          value: eslintDisables.results.length,
          get enabled() {
            return this.value > this.threshold;
          },
          get message() {
            return `There should be no more than ${this.threshold} instances of 'eslint-disable', and you have ${this.value} instances.`;
          },
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
