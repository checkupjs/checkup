import { BaseTaskResult, TaskResult, ui, ResultData } from '@checkup/core';

export default class EslintDisableTaskResult extends BaseTaskResult implements TaskResult {
  eslintDisables!: ResultData;

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
