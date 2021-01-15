import {
  CheckupError,
  CheckupMetadata,
  getRegisteredTaskReporters,
  ui,
  groupDataByField,
  NO_RESULTS_FOUND,
  sumOccurrences,
  combineResultsForRendering,
} from '@checkup/core';
import * as cleanStack from 'clean-stack';
import { startCase } from 'lodash';
import { Invocation, Log, Notification, Result, Run } from 'sarif';
import { renderActions, renderCLIInfo, renderInfo, renderLinesOfCode } from './reporter-utils';

let outputMap: { [taskName: string]: (taskResults: Result[]) => void } = {
  'ember-dependencies': function (taskResults: Result[]) {
    if (!taskResults.some((result: Result) => result.properties?.data !== undefined)) {
      return;
    }

    ui.section(taskResults[0].properties?.taskDisplayName, () => {
      taskResults.forEach((result: Result) => {
        if (result.message.text === NO_RESULTS_FOUND) {
          renderEmptyResult(result);
        } else {
          ui.value({ title: result.message.text, count: result.properties?.data.length });
        }
      });
    });
  },
  'ember-test-types': function (taskResults: Result[]) {
    let groupedTaskResults = groupDataByField(taskResults, 'message.text');

    ui.section(taskResults[0].properties?.taskDisplayName, () => {
      groupedTaskResults.forEach((resultGroup: Result[]) => {
        let groupedTaskResultsByMethod = combineResultsForRendering(
          groupDataByField(resultGroup, 'properties.method')
        );
        ui.subHeader(groupedTaskResultsByMethod[0].message.text);
        ui.valuesList(
          groupedTaskResultsByMethod.map((result) => {
            if (result.message.text === NO_RESULTS_FOUND) {
              renderEmptyResult(result);
            } else {
              return { title: result.properties?.method, count: result.occurrenceCount };
            }
          })
        );
        ui.blankLine();
      });

      ui.subHeader('tests by type');
      ui.sectionedBar(
        groupedTaskResults.map((results: Result[]) => {
          return {
            title: results[0].message.text,
            count: sumOccurrences(results),
          };
        }),
        sumOccurrences(taskResults),
        'tests'
      );
    });
  },
  'ember-octane-migration-status': function (taskResults: Result[]) {
    ui.section(taskResults[0].properties?.taskDisplayName, () => {
      ui.log(`${ui.emphasize('Octane Violations')}: ${sumOccurrences(taskResults)}`);
      ui.blankLine();

      let groupedTaskResults = groupDataByField(taskResults, 'properties.resultGroup');

      groupedTaskResults.forEach((resultGroup: Result[]) => {
        let groupedTaskResultsByLintRuleId = combineResultsForRendering(
          groupDataByField(resultGroup, 'properties.lintRuleId')
        );

        ui.subHeader(groupedTaskResultsByLintRuleId[0].properties?.resultGroup);
        ui.valuesList(
          groupedTaskResultsByLintRuleId.map((result) => {
            if (result.message.text === NO_RESULTS_FOUND) {
              renderEmptyResult(result);
            } else {
              return { title: result.properties?.lintRuleId, count: result.occurrenceCount };
            }
          }),
          'violations'
        );
        ui.blankLine();
      });
    });
  },
  'ember-template-lint-summary': renderLintingSummaryResult,
  'eslint-summary': renderLintingSummaryResult,
  'outdated-dependencies': function (taskResults: Result[]) {
    ui.section(taskResults[0].properties?.taskDisplayName, () => {
      ui.sectionedBar(
        taskResults.map((result: Result) => {
          if (result.message.text === NO_RESULTS_FOUND) {
            renderEmptyResult(result);
          } else {
            return { title: result.message.text, count: result.occurrenceCount };
          }
        }),
        sumOccurrences(taskResults),
        'dependencies'
      );
    });
  },
};

export function report(result: Log) {
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
  let reporter = outputMap[taskName] || registeredTaskReporters.get(taskName) || getReportComponent;

  if (typeof reporter === 'undefined') {
    throw new CheckupError(
      `Unable to find a console reporter for ${taskName}`,
      'Add a console task reporter using a `register-task-reporter` hook'
    );
  }

  return reporter;
}

export function renderEmptyResult(taskResult: Result) {
  ui.value({
    title: taskResult.properties?.consoleMessage || taskResult.properties?.taskDisplayName,
    count: 0,
  });
}

function getReportComponent(taskResults: Result[]) {
  const groupedTaskResults = combineResultsForRendering(
    groupDataByField(taskResults, 'message.text')
  );

  ui.section(groupedTaskResults[0].properties?.taskDisplayName, () => {
    const totalResults = sumOccurrences(groupedTaskResults);

    // if there is only going to be 1 bullet point shown, we dont need to sum the total
    if (groupedTaskResults.length > 1) {
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

function renderLintingSummaryResult(taskResults: Result[]) {
  let groupedTaskResultsByType = groupDataByField(taskResults, 'properties.type');

  ui.section(taskResults[0].properties?.taskDisplayName, () => {
    groupedTaskResultsByType.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByLintRule = combineResultsForRendering(
        groupDataByField(resultGroup, 'properties.lintRuleId')
      ).sort((a, b) => (b.occurrenceCount || 0) - (a.occurrenceCount || 0));
      let totalCount = sumOccurrences(groupedTaskResultsByLintRule);
      if (totalCount) {
        ui.subHeader(`${groupedTaskResultsByLintRule[0].properties?.type}s: (${totalCount})`);
        ui.valuesList(
          groupedTaskResultsByLintRule.map((result) => {
            if (result.message.text === NO_RESULTS_FOUND) {
              renderEmptyResult(result);
            } else {
              return { title: result.properties?.lintRuleId, count: result?.occurrenceCount };
            }
          })
        );
        ui.blankLine();
      }
    });
  });
}
