import * as chalk from 'chalk';
import { startCase } from 'lodash';
import {
  TaskName,
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
} from '@checkup/core';
import TaskList from '../task-list';

let outputMap: { [taskName: string]: (taskResult: TaskResult) => void } = {
  'lines-of-code': function (taskResult: TaskResult) {
    let { dataSummary } = taskResult.result[0];
    ui.section(taskResult.info.taskDisplayName, () => {
      ui.sectionedBar(
        Object.entries<number>(dataSummary.values).map(([key, count]) => {
          return { title: key, count };
        }),
        dataSummary.total,
        'lines'
      );
    });
  },
  'ember-dependencies': function (taskResult: TaskResult) {
    if (!taskResult.result.some((dependency: SummaryResult) => dependency.count > 0)) {
      return;
    }

    ui.section(taskResult.info.taskDisplayName, () => {
      ui.table(
        taskResult.result.map((dependencyGroup: SummaryResult) => {
          return {
            key: dependencyGroup.key,
            count: dependencyGroup.count,
          };
        }),
        {
          key: { header: 'Dependency Groups' },
          count: { header: 'Count' },
        }
      );
    });
  },
  'ember-in-repo-addons-engines': function (taskResult: TaskResult) {
    if (taskResult.result.every((summaryItem: SummaryResult) => summaryItem.count === 0)) {
      return;
    }

    ui.section(taskResult.info.taskDisplayName, () => {
      taskResult.result.forEach((summaryItem: SummaryResult) => {
        ui.log(`${summaryItem.key}: ${summaryItem.count}`);
      });
    });
  },
  'ember-template-lint-disables': function (taskResult: TaskResult) {
    ui.log(`template-lint-disable Usages Found: ${taskResult.result[0].count}`);
    ui.blankLine();
  },
  'ember-test-types': function (taskResult: TaskResult) {
    ui.section(taskResult.info.taskDisplayName, () => {
      taskResult.result.forEach((testTypeInfo: MultiValueResult) => {
        ui.subHeader(testTypeInfo.key);
        ui.table(
          Object.entries(testTypeInfo.dataSummary.values).map(([key, count]) => {
            return { [testTypeInfo.dataSummary.dataKey]: key, count };
          }),
          {
            [testTypeInfo.dataSummary.dataKey]: {},
            count: {},
          }
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
  'ember-types': function (taskResult: TaskResult) {
    ui.section(taskResult.info.taskDisplayName, () => {
      ui.table(
        taskResult.result.map((type: SummaryResult) => {
          return {
            key: type.key,
            count: type.count,
          };
        }),
        {
          key: { header: 'Types' },
          count: { header: 'Count' },
        }
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
  'eslint-disables': function (taskResult: TaskResult) {
    ui.log(`eslint-disable Usages Found: ${taskResult.result[0].count}`);
  },
  'eslint-summary': function (taskResult: TaskResult) {
    let errors = taskResult.result.find(
      (result: MultiValueResult) => result.key === 'eslint-errors'
    )!;
    let warnings = taskResult.result.find(
      (result: MultiValueResult) => result.key === 'eslint-warnings'
    )!;
    let errorsCount = errors.dataSummary.total;
    let warningsCount = warnings.dataSummary.total;

    ui.section(taskResult.info.taskDisplayName, () => {
      if (errorsCount) {
        ui.blankLine();
        ui.subHeader(`Errors (${errorsCount})`);
        ui.valuesList(
          Object.entries<number>(errors.dataSummary.values).map(([key, count]) => {
            return { title: key, count };
          })
        );
      }

      if (warningsCount) {
        ui.blankLine();
        ui.subHeader(`Warnings (${warningsCount})`);
        ui.valuesList(
          Object.entries<number>(warnings.dataSummary.values).map(([key, count]) => {
            return { title: key, count };
          })
        );
      }
    });
  },
  'outdated-dependencies': function (taskResult: TaskResult) {
    let { values: dependenciesCount, total: totalDependencies } = taskResult.result[0].dataSummary;

    ui.section(taskResult.info.taskDisplayName, () => {
      ui.sectionedBar(
        [
          { title: 'major', count: dependenciesCount.major },
          { title: 'minor', count: dependenciesCount.minor },
          { title: 'patch', count: dependenciesCount.patch },
        ],
        totalDependencies
      );
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

    let reporter = getTaskReporter(taskResult.info.taskName);

    reporter(taskResult);
  });
  ui.blankLine();
}

function getTaskReporter(taskName: TaskName) {
  let registeredTaskReporters = getRegisteredTaskReporters();
  let reporter = outputMap[taskName] || registeredTaskReporters.get(taskName);

  if (typeof reporter === 'undefined') {
    throw new CheckupError(
      `Unable to find a console reporter for ${taskName}`,
      'Add a console task reporter using a `register-task-reporter` hook'
    );
  }

  return reporter;
}

function renderActions(actions: Action[]): void {
  if (actions.length > 0) {
    let tabularActions = actions.map((action) => {
      return {
        summary: action.summary,
        details: action.details,
      };
    });

    ui.categoryHeader('Actions');
    ui.table(tabularActions, { summary: { header: 'Summary' }, details: { header: 'Details' } });
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
    ui.table(errors, { taskName: {}, error: {} });
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
