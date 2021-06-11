import {
  CheckupError,
  CheckupMetadata,
  getRegisteredTaskReporters,
  groupDataByField,
  sumOccurrences,
  reduceResults,
  renderEmptyResult,
  ErrorKind,
  FormatterArgs,
} from '@checkup/core';
import * as cleanStack from 'clean-stack';
import { startCase } from 'lodash';
import { Invocation, Log, Notification, Result, Run } from 'sarif';
import { renderActions, renderCLIInfo, renderInfo, renderLinesOfCode } from './formatter-utils';
import { writeResultFile } from './file-writer';
export default class PrettyFormatter {
  args: FormatterArgs;

  constructor(args: FormatterArgs) {
    this.args = args;
  }

  format(result: Log) {
    let metaData = result.properties as CheckupMetadata;

    renderInfo(metaData, this.args);
    renderLinesOfCode(metaData, this.args);

    result.runs.forEach((run: Run) => {
      this.renderTaskResults(run.results);
      run.invocations?.forEach((invocation: Invocation) => {
        this.renderErrors(invocation.toolExecutionNotifications);
      });
    });

    renderActions(result.properties?.actions, this.args);

    if (process.env.CHECKUP_TIMING === '1') {
      this.renderTimings(result.properties?.timings);
    }

    renderCLIInfo(metaData, this.args);

    if (this.args.outputFile) {
      writeResultFile(this.args.writer.outputString, this.args.cwd, this.args.outputFile);
    }
  }

  renderTaskResults(pluginTaskResults: Result[] | undefined): void {
    let currentCategory = '';

    if (pluginTaskResults) {
      let groupedTaskResults = groupDataByField(pluginTaskResults, 'ruleId');

      groupedTaskResults?.forEach((taskResultGroup: Result[]) => {
        let taskCategory = taskResultGroup[0].properties?.category;

        if (taskCategory !== currentCategory) {
          this.args.writer.categoryHeader(startCase(taskCategory));
          currentCategory = taskCategory;
        }

        let reporter = this.getTaskReporter(taskResultGroup);

        reporter(taskResultGroup, this.args);
      });
    }
    this.args.writer.blankLine();
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

    this.args.writer.section(groupedTaskResults[0].properties?.taskDisplayName, () => {
      const totalResults = sumOccurrences(groupedTaskResults);
      const numberOfBulletPoints = groupedTaskResults.length;

      if (numberOfBulletPoints > 1) {
        this.args.writer.log(`Total: ${totalResults}`);
      }

      groupedTaskResults.forEach((result) => {
        if (result.message.text === 'No results found') {
          renderEmptyResult(result);
        } else {
          this.args.writer.value({
            title: result.message.text || (result.ruleId as string),
            count: result?.occurrenceCount || Number.NaN,
          });
        }
      });
    });
  }

  renderErrors(notifications: Notification[] | undefined) {
    if (notifications && notifications.length > 0) {
      this.args.writer.table(
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

    this.args.writer.categoryHeader('Task Timings');

    this.args.writer.table(
      Object.keys(timings)
        .map((taskName) => [
          taskName,
          Number.parseFloat(timings[taskName].toFixed(2)),
          `${((timings[taskName] * 100) / total).toFixed(1)}%`,
        ])
        .sort((a, b) => (b[1] as number) - (a[1] as number)),
      ['Task Name', 'Time (sec)', 'Relative']
    );

    this.args.writer.blankLine();
  }
}
