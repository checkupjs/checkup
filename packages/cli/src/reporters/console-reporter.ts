import {
  Action,
  CheckupError,
  CheckupMetadata,
  getRegisteredTaskReporters,
  ui,
  groupDataByField,
  NO_RESULTS_FOUND,
  sumOccurrences,
} from '@checkup/core';
import { bold, yellow } from 'chalk';
import * as cleanStack from 'clean-stack';
import { startCase } from 'lodash';
import { Invocation, Log, Notification, Result, Run } from 'sarif';
import TaskList from '../task-list';

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
        ui.subHeader(resultGroup[0].message.text);
        ui.valuesList(
          resultGroup.map((result) => {
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
        ui.subHeader(resultGroup[0].properties?.resultGroup);
        ui.valuesList(
          resultGroup.map((result) => {
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
  'eslint-summary': function (taskResults: Result[]) {
    let groupedTaskResults = groupDataByField(taskResults, 'properties.type');

    ui.section(taskResults[0].properties?.taskDisplayName, () => {
      groupedTaskResults.forEach((resultGroup: Result[]) => {
        let totalCount = sumOccurrences(resultGroup);
        if (totalCount) {
          ui.subHeader(`${resultGroup[0].properties?.type}s: (${totalCount})`);
          ui.valuesList(
            resultGroup.map((result) => {
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
  },
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
  renderInfo(result.properties as CheckupMetadata);

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
}

export function reportAvailableTasks(pluginTasks: TaskList) {
  ui.blankLine();
  ui.log(bold.white('AVAILABLE TASKS'));
  ui.blankLine();
  pluginTasks.fullyQualifiedTaskNames.forEach((taskName) => {
    ui.log(`  ${taskName}`);
  });
  ui.blankLine();
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
    title: taskResult.message.properties?.consoleMessage || taskResult.properties?.taskDisplayName,
    count: 0,
  });
}

function getReportComponent(taskResults: Result[]) {
  ui.section(taskResults[0].properties?.taskDisplayName, () => {
    taskResults.forEach((result) => {
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

function renderActions(actions: Action[]): void {
  if (actions && actions.length > 0) {
    ui.categoryHeader('Actions');
    actions.forEach((action: Action) => {
      ui.log(`${yellow('■')} ${bold(action.summary)} (${action.details})`);
    });
    ui.blankLine();
  }
}

function renderInfo(info: CheckupMetadata) {
  let { analyzedFilesCount } = info;
  let { name, version, repository } = info.project;
  let { version: cliVersion, configHash } = info.cli;

  let analyzedFilesMessage =
    repository.totalFiles !== analyzedFilesCount
      ? ` (${ui.emphasize(`${analyzedFilesCount} files`)} analyzed)`
      : '';

  ui.blankLine();
  ui.log(
    `Checkup report generated for ${ui.emphasize(`${name} v${version}`)}${analyzedFilesMessage}`
  );
  ui.blankLine();
  ui.log(
    `This project is ${ui.emphasize(`${repository.age} old`)}, with ${ui.emphasize(
      `${repository.activeDays} active days`
    )}, ${ui.emphasize(`${repository.totalCommits} commits`)} and ${ui.emphasize(
      `${repository.totalFiles} files`
    )}.`
  );
  ui.blankLine();

  ui.dimmed(`checkup v${cliVersion}`);
  ui.dimmed(`config ${configHash}`);
  ui.blankLine();

  ui.sectionedBar(
    repository.linesOfCode.types.map((type) => {
      return { title: type.extension, count: type.total };
    }),
    repository.linesOfCode.total,
    'lines of code'
  );

  ui.blankLine();
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
