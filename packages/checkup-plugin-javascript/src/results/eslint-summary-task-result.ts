import {
  BaseTaskResult,
  TaskResult,
  ui,
  ESLintReport,
  ActionsEvaluator,
  Action,
} from '@checkup/core';
import { Linter } from 'eslint';
import * as chalk from 'chalk';

interface EslintFailureCounts {
  failureCount: number;
  fixableFailureCount: number;
}

interface FormattedESLintReport {
  errorCount: number;
  warningCount: number;
  errorList: { rule: string; failures: string }[];
  warningList: { rule: string; failures: string }[];
}

export default class EslintSummaryTaskResult extends BaseTaskResult implements TaskResult {
  actions: Action[] = [];

  data!: {
    esLintReport: ESLintReport;
    sortedESLintReport: FormattedESLintReport;
  };

  process(data: { esLintReport: ESLintReport }) {
    this.data = {
      ...{ sortedESLintReport: transformEslintReport(data.esLintReport) },
      ...data,
    };

    let actionsEvaluator = new ActionsEvaluator();
    let errorCount = this.data.sortedESLintReport.errorCount;
    let warningCount = this.data.sortedESLintReport.warningCount;

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
    ui.section(this.meta.friendlyTaskName, () => {
      ui.log(`Error count: ${chalk.red(this.data.sortedESLintReport.errorCount)}`);
      ui.log(`Warning count: ${chalk.yellow(this.data.sortedESLintReport.warningCount)}`);

      if (this.data.sortedESLintReport.errorList.length > 0) {
        ui.blankLine();
        ui.subHeader('Errors');
        ui.table(this.data.sortedESLintReport.errorList, {
          rule: { header: 'Rule name' },
          failures: {},
        });
      }

      if (this.data.sortedESLintReport.warningList.length > 0) {
        ui.blankLine();
        ui.subHeader('Warnings');
        ui.table(this.data.sortedESLintReport.warningList, {
          rule: { header: 'Rule name' },
          failures: {},
        });
      }
    });
  }

  toJson() {
    return { meta: this.meta, result: { esLintReport: this.data.esLintReport } };
  }
}

function transformEslintReport(esLintReport: ESLintReport): FormattedESLintReport {
  let errors: Record<string, EslintFailureCounts> = {};
  let warnings: Record<string, EslintFailureCounts> = {};

  // we want to strip these from total counts (generally they are just a warning that a file was ignored)
  let warningsWithoutRulesIds = 0;

  esLintReport.results.forEach((result) => {
    if (result.messages.length > 0) {
      result.messages.forEach((msg) => {
        // severity 1 is a warning
        if (msg.severity === 1) {
          if (msg.ruleId) {
            updateFailureCounts(msg, warnings);
          } else {
            warningsWithoutRulesIds++;
          }
        } else {
          updateFailureCounts(msg, errors);
        }
      });
    }
  });

  return {
    errorCount: esLintReport.errorCount,
    warningCount: esLintReport.warningCount - warningsWithoutRulesIds,
    errorList: createFailureList(errors, 'errors'),
    warningList: createFailureList(warnings, 'warnings'),
  };
}

function updateFailureCounts(msg: Linter.LintMessage, record: Record<string, EslintFailureCounts>) {
  if (msg.ruleId) {
    // this is the first time we've encountered this rule being violated, so create a record of it
    if (!record[msg.ruleId]) {
      record[msg.ruleId] = {
        fixableFailureCount: 0,
        failureCount: 0,
      };
    }

    if (msg.fix) {
      record[msg.ruleId].fixableFailureCount += 1;
    } else {
      record[msg.ruleId].failureCount += 1;
    }
  }
}

function createFailureList(record: Record<string, EslintFailureCounts>, failureType: string) {
  let chalkColor: Function = failureType === 'errors' ? chalk.red : chalk.yellow;

  return Object.entries(record).map((arr) => {
    let ruleId = arr[0];
    let eslintFailureCounts = arr[1];
    let totalFailureCount =
      eslintFailureCounts.failureCount + eslintFailureCounts.fixableFailureCount;

    return {
      rule: ruleId,
      failures: `${chalkColor(totalFailureCount)} ${failureType} (${
        eslintFailureCounts.fixableFailureCount
      } fixable)`,
    };
  });
}
