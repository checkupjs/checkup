import {
  CheckupError,
  CheckupMetadata,
  getRegisteredTaskReporters,
  ui,
  groupDataByField,
  NO_RESULTS_FOUND,
  sumOccurrences,
  reduceResults,
  renderEmptyResult,
} from '@checkup/core';
import * as cleanStack from 'clean-stack';
import { startCase } from 'lodash';
import { Invocation, Log, Notification, Result, Run } from 'sarif';
import { renderActions, renderCLIInfo, renderInfo, renderLinesOfCode } from './reporter-utils';
import { ReportOptions } from './get-reporter2';

export default class VerboseConsoleReporter {
  options: ReportOptions;

  constructor(options: ReportOptions) {
    this.options = options;
  }

  report(result: Log) {
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
        ui.categoryHeader(startCase(taskCategory));
        currentCategory = taskCategory;
      }

      let reporter = getTaskReporter(taskResultGroup);

      reporter(taskResultGroup);
    });
  }
  ui.blankLine();
}

function getTaskReporter(taskResult: Result[]) {
  let taskName = taskResult[0].ruleId as string;
  let registeredTaskReporters = getRegisteredTaskReporters();
  let reporter = registeredTaskReporters.get(taskName) || getReportComponent;

  if (typeof reporter === 'undefined') {
    throw new CheckupError(
      `Unable to find a console reporter for ${taskName}`,
      'Add a console task reporter using a `register-task-reporter` hook'
    );
  }

  return reporter;
}

function getReportComponent(taskResults: Result[]) {
  const groupedTaskResults = reduceResults(groupDataByField(taskResults, 'message.text'));

  ui.section(groupedTaskResults[0].properties?.taskDisplayName, () => {
    const totalResults = sumOccurrences(groupedTaskResults);
    const numberOfBulletPoints = groupedTaskResults.length;

    if (numberOfBulletPoints > 1) {
      ui.log(`Total: ${totalResults}`);
    }

    groupedTaskResults.forEach((result) => {
      if (result.message.text === NO_RESULTS_FOUND) {
        renderEmptyResult(result);
      } else {
        ui.value({
          title: result.message.text || result.ruleId,
          count: result?.occurrenceCount || Number.NaN,
        });
      }
    });
  });
}

function renderErrors(notifications: Notification[] | undefined) {
  if (notifications && notifications.length > 0) {
    ui.table(
      notifications.map((notification) => {
        return {
          taskName: notification.associatedRule?.id,
          stack: cleanStack(notification.properties?.fullError || ''),
        };
      }),
      { taskName: {}, stack: { header: 'Error' } }
    );
  }
}

function renderTimings(timings: Record<string, number>) {
  let total = Object.values(timings).reduce((total, timing) => (total += timing), 0);

  ui.categoryHeader('Task Timings');
  ui.table(
    Object.keys(timings)
      .map((taskName) => {
        return {
          taskName,
          time: timings[taskName],
          relative: `${((timings[taskName] * 100) / total).toFixed(1)}%`,
        };
      })
      .sort((a, b) => b.time - a.time),
    {
      taskName: {},
      timeFormatted: { header: 'Time', get: (row) => `${row.time.toFixed(1)}s` },
      relative: {},
    }
  );
  ui.blankLine();
}
