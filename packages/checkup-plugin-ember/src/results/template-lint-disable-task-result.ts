import { BaseTaskResult, TaskResult, ui, ResultData } from '@checkup/core';

export default class TemplateLintDisableTaskResult extends BaseTaskResult implements TaskResult {
  templateLintDisables!: ResultData;

  toConsole() {
    ui.log(`template-lint-disable Usages Found: ${this.templateLintDisables.results.length}`);
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
}
