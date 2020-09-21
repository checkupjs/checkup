import * as chalk from 'chalk';
import { startCase } from 'lodash';
import {
  TaskResult,
  TaskError,
  Action,
  getRegisteredTaskReporters,
  CheckupError,
  CheckupResult,
  SummaryResult,
  MultiValueResult,
  DataSummary,
  ui,
  Result,
} from '@checkup/core';
import { yellow, bold } from 'chalk';
import TaskList from '../task-list';
import * as cleanStack from 'clean-stack';

let outputMap: { [taskName: string]: (taskResult: TaskResult) => void } = {
  'ember-test-types': function (taskResult: TaskResult) {
    ui.section(taskResult.info.taskDisplayName, () => {
      taskResult.result.forEach((testTypeInfo: MultiValueResult) => {
        ui.subHeader(testTypeInfo.key);
        ui.valuesList(
          Object.entries(testTypeInfo.dataSummary.values).map(([key, count]) => {
            return { title: key, count };
          })
        );
        ui.blankLine();
      });

      ui.subHeader('tests by type');
      ui.sectionedBar(
        taskResult.result.map((testType: MultiValueResult) => {
          return {
            title: testType.key,
            count: testType.dataSummary.total,
          };
        }),
        taskResult.result.reduce(
          (total: number, result: MultiValueResult) => total + result.dataSummary.total,
          0
        ),
        'tests'
      );
    });
  },

  'ember-octane-migration-status': function (taskResult: TaskResult) {
    ui.section(taskResult.info.taskDisplayName, () => {
      ui.log(
        `${ui.emphasize('Octane Violations')}: ${taskResult.result.reduce(
          (violationsCount: number, result: MultiValueResult) => {
            return violationsCount + result.dataSummary.total;
          },
          0
        )}`
      );
      ui.blankLine();
      taskResult.result.forEach(
        ({ key, dataSummary }: { key: string; dataSummary: DataSummary }) => {
          ui.subHeader(key);
          ui.valuesList(
            Object.entries<number>(dataSummary.values).map(([key, total]) => {
              return { title: key, count: total };
            }),
            'violations'
          );
          ui.blankLine();
        }
      );
    });
  },
  'eslint-summary': function (taskResult: TaskResult) {
    ui.section(taskResult.info.taskDisplayName, () => {
      taskResult.result.forEach((result: MultiValueResult) => {
        ui.blankLine();
        ui.subHeader(`${result.key} (${result.dataSummary.total})`);
        ui.valuesList(
          Object.entries<number>(result.dataSummary.values).map(([key, count]) => {
            return { title: key, count };
          })
        );
      });
    });
  },
  'lines-of-code': function (taskResult: TaskResult) {
    ui.section(taskResult.info.taskDisplayName, () => {
      taskResult.result.forEach((result: MultiValueResult) => {
        let dataSummary = result.dataSummary;
        ui.sectionedBar(
          Object.entries<number>(dataSummary.values).map(([key, count]) => {
            return { title: key, count };
          }),
          dataSummary.total,
          'lines'
        );
      });
    });
  },
  'outdated-dependencies': function (taskResult: TaskResult) {
    ui.section(taskResult.info.taskDisplayName, () => {
      taskResult.result.forEach((result: MultiValueResult) => {
        let dataSummary = result.dataSummary;
        ui.sectionedBar(
          Object.keys(dataSummary.values).map((value) => {
            return { title: value, count: dataSummary.values[value] };
          }),
          dataSummary.total,
          'dependencies'
        );
      });
    });
  },
  foo: function (taskResult: TaskResult) {
    ui.categoryHeader(taskResult.info.taskDisplayName);
  },
  'file-count': function (taskResult: TaskResult) {
    ui.section(taskResult.info.taskDisplayName, () => {
      ui.log(taskResult.result.result);
    });
  },
};

export function report(result: CheckupResult) {
  renderInfo(result.info);
  renderTaskResults(result.results);
  renderActions(result.actions);
  renderErrors(result.errors);

  if (process.env.CHECKUP_TIMING === '1') {
    renderTimings(result.info.cli.timings);
  }
}

export function reportAvailableTasks(pluginTasks: TaskList) {
  ui.blankLine();
  ui.log(chalk.bold.white('AVAILABLE TASKS'));
  ui.blankLine();
  pluginTasks.fullyQualifiedTaskNames.forEach((taskName) => {
    ui.log(`  ${taskName}`);
  });
  ui.blankLine();
}

function renderTaskResults(pluginTaskResults: TaskResult[]): void {
  let currentCategory = '';

  pluginTaskResults.forEach((taskResult) => {
    let taskCategory = taskResult.info.category;

    if (taskCategory !== currentCategory) {
      ui.categoryHeader(startCase(taskCategory));
      currentCategory = taskCategory;
    }

    let reporter = getTaskReporter(taskResult);

    reporter(taskResult);
  });
  ui.blankLine();
}

function getTaskReporter(taskResult: TaskResult) {
  let taskName = taskResult.info.taskName;
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

function getReportComponent(taskResult: TaskResult) {
  ui.section(taskResult.info.taskDisplayName, () => {
    taskResult.result.forEach((result: Result) => {
      let type = result.type;

      if (type === 'summary') {
        ui.value({ title: result.key, count: (<SummaryResult>result).count });
      }
    });
  });
}

function renderActions(actions: Action[]): void {
  if (actions.length > 0) {
    ui.categoryHeader('Actions');
    actions.forEach((action: Action) => {
      ui.log(`${yellow('■')} ${bold(action.summary)} (${action.details})`);
    });
    ui.blankLine();
  }
}

function renderInfo(info: CheckupResult['info']) {
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
}

function renderErrors(errors: TaskError[]) {
  if (errors.length > 0) {
    ui.table(
      errors.map((taskError) => {
        return {
          taskName: taskError.taskName,
          stack: cleanStack(taskError.error.stack || ''),
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
