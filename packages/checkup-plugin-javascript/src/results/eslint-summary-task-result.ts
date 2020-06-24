import {
  BaseTaskResult,
  TaskResult,
  ui,
  ESLintReport,
  ActionList,
  TaskMetaData,
  TaskConfig,
} from '@checkup/core';
import { Linter } from 'eslint';
import * as chalk from 'chalk';

interface EslintFailureCounts {
  failureCount: number;
  fixableFailureCount: number;
}

interface FormattedEslintReport {
  errorCount: number;
  warningCount: number;
  errorList: { rule: string; failures: string }[];
  warningList: { rule: string; failures: string }[];
}

export default class EslintSummaryTaskResult extends BaseTaskResult implements TaskResult {
  sortedEslintReport: FormattedEslintReport;

  constructor(meta: TaskMetaData, config: TaskConfig, public esLintReport: ESLintReport) {
    super(meta, config);

    this.sortedEslintReport = transformEslintReport(esLintReport);
    this.actionList = new ActionList(
      [
        {
          name: 'num-eslint-errors',
          threshold: 20,
          value: this.sortedEslintReport.errorCount,
          get enabled() {
            return this.value > this.threshold;
          },
          get message() {
            return `There are ${this.value} eslint errors, there should be at most ${this.threshold}.`;
          },
        },
        {
          name: 'num-eslint-warnings',
          threshold: 20,
          value: this.sortedEslintReport.warningCount,
          get enabled() {
            return this.value > this.threshold;
          },
          get message() {
            return `There are ${this.value} eslint warnings, there should be at most ${this.threshold}.`;
          },
        },
      ],
      config
    );
  }

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.log(`Error count: ${chalk.red(this.sortedEslintReport.errorCount)}`);
      ui.log(`Warning count: ${chalk.yellow(this.sortedEslintReport.warningCount)}`);

      if (this.sortedEslintReport.errorList.length > 0) {
        ui.blankLine();
        ui.subHeader('Errors');
        ui.table(this.sortedEslintReport.errorList, {
          rule: { header: 'Rule name' },
          failures: {},
        });
      }

      if (this.sortedEslintReport.warningList.length > 0) {
        ui.blankLine();
        ui.subHeader('Warnings');
        ui.table(this.sortedEslintReport.warningList, {
          rule: { header: 'Rule name' },
          failures: {},
        });
      }
    });
  }

  toJson() {
    return { meta: this.meta, result: { esLintReport: this.esLintReport } };
  }
}

function transformEslintReport(esLintReport: ESLintReport): FormattedEslintReport {
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
