import {
  BaseTaskResult,
  TaskResult,
  ui,
  ActionsEvaluator,
  Action,
  DerivedValueResult,
} from '@checkup/core';

export default class EslintSummaryTaskResult extends BaseTaskResult implements TaskResult {
  actions: Action[] = [];
  data: DerivedValueResult[] = [];
  private errors!: DerivedValueResult;
  private warnings!: DerivedValueResult;

  process(data: DerivedValueResult[]) {
    this.data = data;

    let actionsEvaluator = new ActionsEvaluator();

    this.errors = this.data.find((result) => result.key === 'eslint-errors')!;
    this.warnings = this.data.find((result) => result.key === 'eslint-warnings')!;

    let errorCount = this.errors.dataSummary.total;
    let warningCount = this.warnings.dataSummary.total;

    actionsEvaluator.add({
      name: 'reduce-eslint-errors',
      summary: 'Reduce number of eslint errors',
      details: `${errorCount} total errors`,
      defaultThreshold: 20,
      items: [`Total eslint errors: ${errorCount}`],
      input: errorCount,
    });

    actionsEvaluator.add({
      name: 'reduce-eslint-warnings',
      summary: 'Reduce number of eslint warnings',
      details: `${warningCount} total warnings`,
      defaultThreshold: 20,
      items: [`Total eslint warnings: ${warningCount}`],
      input: warningCount,
    });

    this.actions = actionsEvaluator.evaluate(this.config);
  }

  toConsole() {
    let errorsCount = this.errors.dataSummary.total;
    let warningsCount = this.warnings.dataSummary.total;

    ui.section(this.meta.friendlyTaskName, () => {
      if (errorsCount) {
        ui.blankLine();
        ui.subHeader(`Errors (${errorsCount})`);
        ui.valuesList(
          Object.entries(this.errors.dataSummary.values).map(([key, count]) => {
            return { title: key, count };
          })
        );
      }

      if (warningsCount) {
        ui.blankLine();
        ui.subHeader(`Errors (${warningsCount})`);
        ui.valuesList(
          Object.entries(this.warnings.dataSummary.values).map(([key, count]) => {
            return { title: key, count };
          })
        );
      }
    });
  }

  toJson() {
    return { info: this.meta, result: this.data };
  }
}
