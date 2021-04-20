import {
  CheckupError,
  CheckupMetadata,
  getRegisteredTaskReporters,
  ConsoleWriter,
  groupDataByField,
  NO_RESULTS_FOUND,
  sumOccurrences,
  reduceResults,
  renderEmptyResult,
  ErrorKind,
  FormatArgs,
} from '@checkup/core';
import * as cleanStack from 'clean-stack';
import { startCase } from 'lodash';
import { Invocation, Log, Notification, Result, Run } from 'sarif';
import { renderActions, renderCLIInfo, renderInfo, renderLinesOfCode } from './formatter-utils';
import { ReportOptions } from './get-formatter';
import { writeResultFile } from './file-writer';
export default class PrettyFormatter {
  options: ReportOptions;
  consoleWriter: ConsoleWriter;
  formatArgs: FormatArgs;

  constructor(options: ReportOptions) {
    this.options = options;
    this.consoleWriter = new ConsoleWriter(options.outputFile !== '' ? 'file' : 'console');
    this.formatArgs = { writer: this.consoleWriter };
  }

  format(result: Log) {
    let metaData = result.properties as CheckupMetadata;

    renderInfo(metaData, this.formatArgs);
    renderLinesOfCode(metaData, this.formatArgs);

    result.runs.forEach((run: Run) => {
      this.renderTaskResults(run.results);
      run.invocations?.forEach((invocation: Invocation) => {
        this.renderErrors(invocation.toolExecutionNotifications);
      });
    });

    renderActions(result.properties?.actions, this.formatArgs);

    if (process.env.CHECKUP_TIMING === '1') {
      this.renderTimings(result.properties?.timings);
    }

    renderCLIInfo(metaData, this.formatArgs);

    if (this.options.outputFile) {
      writeResultFile(this.consoleWriter.outputString, this.options.cwd, this.options.outputFile);
    }
  }

  renderTaskResults(pluginTaskResults: Result[] | undefined): void {
    let currentCategory = '';

    if (pluginTaskResults) {
      let groupedTaskResults = groupDataByField(pluginTaskResults, 'ruleId');

      groupedTaskResults?.forEach((taskResultGroup: Result[]) => {
        let taskCategory = taskResultGroup[0].properties?.category;

        if (taskCategory !== currentCategory) {
          this.consoleWriter.categoryHeader(startCase(taskCategory));
          currentCategory = taskCategory;
        }

        let reporter = this.getTaskReporter(taskResultGroup);

        reporter(taskResultGroup, this.formatArgs);
      });
    }
    this.consoleWriter.blankLine();
  }

  getTaskReporter(taskResult: Result[]) {
    let taskName = taskResult[0].ruleId as string;
    let registeredTaskReporters = getRegisteredTaskReporters();
    let reporter = registeredTaskReporters.get(taskName) || this.getReportComponent.bind(this);

    if (typeof reporter === 'undefined') {
      throw new CheckupError(ErrorKind.TaskConsoleReporterNotFound, { taskName });
    }

    return reporter;
  }

  getReportComponent(taskResults: Result[]) {
    const groupedTaskResults = reduceResults(groupDataByField(taskResults, 'message.text'));

    this.consoleWriter.section(groupedTaskResults[0].properties?.taskDisplayName, () => {
      const totalResults = sumOccurrences(groupedTaskResults);
      const numberOfBulletPoints = groupedTaskResults.length;

      if (numberOfBulletPoints > 1) {
        this.consoleWriter.log(`Total: ${totalResults}`);
      }

      groupedTaskResults.forEach((result) => {
        if (result.message.text === NO_RESULTS_FOUND) {
          renderEmptyResult(result);
        } else {
          this.consoleWriter.value({
            title: result.message.text || (result.ruleId as string),
            count: result?.occurrenceCount || Number.NaN,
          });
        }
      });
    });
  }

  renderErrors(notifications: Notification[] | undefined) {
    if (notifications && notifications.length > 0) {
      this.consoleWriter.table(
        notifications.map((notification) => {
          return [
            notification.associatedRule?.id as string,
            cleanStack(notification.properties?.fullError || ''),
          ];
        }),
        ['Task Name', 'Error']
      );
    }
  }

  renderTimings(timings: Record<string, number>) {
    let total = Object.values(timings).reduce((total, timing) => (total += timing), 0);

    this.consoleWriter.categoryHeader('Task Timings');

    this.consoleWriter.table(
      Object.keys(timings)
        .map((taskName) => [
          taskName,
          Number.parseFloat(timings[taskName].toFixed(2)),
          `${((timings[taskName] * 100) / total).toFixed(1)}%`,
        ])
        .sort((a, b) => (b[1] as number) - (a[1] as number)),
      ['Task Name', 'Time (sec)', 'Relative']
    );

    this.consoleWriter.blankLine();
  }
}
