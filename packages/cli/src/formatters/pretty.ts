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
} from '@checkup/core';
import * as cleanStack from 'clean-stack';
import { startCase } from 'lodash';
import { Invocation, Log, Notification, Result, Run } from 'sarif';
import { renderActions, renderCLIInfo, renderInfo, renderLinesOfCode } from './formatter-utils';
import { ReportOptions } from './get-formatter';

const consoleWriter = new ConsoleWriter();
export default class PrettyFormatter {
  options: ReportOptions;

  constructor(options: ReportOptions) {
    this.options = options;
  }

  format(result: Log) {
    let metaData = result.properties as CheckupMetadata;

    renderInfo(metaData);
    renderLinesOfCode(metaData);

    result.runs.forEach((run: Run) => {
      renderTaskResults(run.results);
      run.invocations?.forEach((invocation: Invocation) => {
        renderErrors(invocation.toolExecutionNotifications);
      });
    });

    renderActions(result.properties?.actions);

    if (process.env.CHECKUP_TIMING === '1') {
      renderTimings(result.properties?.timings);
    }

    renderCLIInfo(metaData);
  }
}

function renderTaskResults(pluginTaskResults: Result[] | undefined): void {
  let currentCategory = '';

  if (pluginTaskResults) {
    let groupedTaskResults = groupDataByField(pluginTaskResults, 'ruleId');

    groupedTaskResults?.forEach((taskResultGroup: Result[]) => {
      let taskCategory = taskResultGroup[0].properties?.category;

      if (taskCategory !== currentCategory) {
        consoleWriter.categoryHeader(startCase(taskCategory));
        currentCategory = taskCategory;
      }

      let reporter = getTaskReporter(taskResultGroup);

      reporter(taskResultGroup);
    });
  }
  consoleWriter.blankLine();
}

function getTaskReporter(taskResult: Result[]) {
  let taskName = taskResult[0].ruleId as string;
  let registeredTaskReporters = getRegisteredTaskReporters();
  let reporter = registeredTaskReporters.get(taskName) || getReportComponent;

  if (typeof reporter === 'undefined') {
    throw new CheckupError(ErrorKind.TaskConsoleReporterNotFound, { taskName });
  }

  return reporter;
}

function getReportComponent(taskResults: Result[]) {
  const groupedTaskResults = reduceResults(groupDataByField(taskResults, 'message.text'));

  consoleWriter.section(groupedTaskResults[0].properties?.taskDisplayName, () => {
    const totalResults = sumOccurrences(groupedTaskResults);
    const numberOfBulletPoints = groupedTaskResults.length;

    if (numberOfBulletPoints > 1) {
      consoleWriter.log(`Total: ${totalResults}`);
    }

    groupedTaskResults.forEach((result) => {
      if (result.message.text === NO_RESULTS_FOUND) {
        renderEmptyResult(result);
      } else {
        consoleWriter.value({
          title: result.message.text || (result.ruleId as string),
          count: result?.occurrenceCount || Number.NaN,
        });
      }
    });
  });
}

function renderErrors(notifications: Notification[] | undefined) {
  if (notifications && notifications.length > 0) {
    consoleWriter.table(
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

function renderTimings(timings: Record<string, number>) {
  let total = Object.values(timings).reduce((total, timing) => (total += timing), 0);

  consoleWriter.categoryHeader('Task Timings');

  consoleWriter.table(
    Object.keys(timings)
      .map((taskName) => [
        taskName,
        Number.parseFloat(timings[taskName].toFixed(2)),
        `${((timings[taskName] * 100) / total).toFixed(1)}%`,
      ])
      .sort((a, b) => (b[1] as number) - (a[1] as number)),
    ['Task Name', 'Time (sec)', 'Relative']
  );

  consoleWriter.blankLine();
}
