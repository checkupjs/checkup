import { Result, Log, Invocation } from 'sarif';
import {
  RunFlags,
  TaskError,
  Action,
  CheckupConfig,
  Task,
  TaskContext,
  ui,
  CheckupError,
  getRegisteredActions,
  getConfigPathFromOptions,
  getConfigPath,
  readConfig,
  registerParser,
  registerActions,
  registerTaskReporter,
  loadPlugins,
  getRegisteredParsers,
  FilePathArray,
  getFilePathsAsync,
  buildNotificationsFromTaskErrors,
} from '@checkup/core';
import { BaseCommand } from './base-command';
import TaskList from './task-list';
import { getLog } from './get-log';
import { TASK_ERRORS } from './task-errors';
import { getPackageJson } from './utils/get-package-json';
import { getReporter } from './reporters/get-reporter';
import { reportAvailableTasks } from './reporters/available-task-reporter';

let __tasksForTesting: Set<Task> = new Set<Task>();

export function _registerTaskForTesting(task: Task) {
  __tasksForTesting.add(task);
}
export function _resetTasksForTesting() {
  __tasksForTesting = new Set<Task>();
}

export abstract class BaseTaskCommand extends BaseCommand {
  runArgs!: string[];
  runFlags!: RunFlags;
  pluginTasks: TaskList = new TaskList();
  pluginTaskResults: Result[] = [];
  pluginTaskErrors: TaskError[] = [];
  startTime: string = '';
  actions: Action[] = [];
  checkupConfig!: CheckupConfig;
  executedTasks!: Task[];
  cliModeEnabled: boolean = true;
  taskContext!: TaskContext;

  get taskFilterType() {
    if (this.runFlags.task !== undefined) {
      return 'task';
    } else if (this.runFlags.category !== undefined) {
      return 'category';
    } else if (this.runFlags.group !== undefined) {
      return 'group';
    }

    return '';
  }

  public async run() {
    await this.loadConfig();

    await this.register();

    if (this.runFlags['list-tasks']) {
      this.printAvailableTasks();
    } else {
      if (this.cliModeEnabled) {
        ui.action.start('Checking up on your project');
      }

      await this.runTasks();
      await this.runActions();

      let log: Log = await getLog(
        this.taskContext,
        this.pluginTaskResults,
        this.actions,
        this.getInvocation(this.pluginTaskErrors),
        this.pluginTasks,
        this.executedTasks
      );

      if (this.cliModeEnabled) {
        this.report(log);
        ui.action.stop();
      }

      return log;
    }
  }

  private async runTasks() {
    if (this.taskFilterType) {
      let { tasksFound, tasksNotFound } = this.findTasks();

      if (tasksFound.length > 0) {
        [this.pluginTaskResults, this.pluginTaskErrors] = await this.pluginTasks.runTasks(
          tasksFound
        );
      }

      if (tasksNotFound.length > 0) {
        let error = TASK_ERRORS.get(this.taskFilterType)!;

        this.extendedError(new CheckupError(error.message(tasksNotFound), error.callToAction));
        ui.action.stop();
      }

      this.executedTasks = tasksFound;
    } else {
      [this.pluginTaskResults, this.pluginTaskErrors] = await this.pluginTasks.runTasks();
      this.executedTasks = this.pluginTasks.getTasks();
    }
  }

  private findTasks() {
    if (this.runFlags.task !== undefined) {
      return this.pluginTasks.findAllByTaskName(...this.runFlags.task);
    } else if (this.runFlags.category !== undefined) {
      return this.pluginTasks.findAllByCategory(...this.runFlags.category);
    } else if (this.runFlags.group !== undefined) {
      return this.pluginTasks.findAllByGroup(...this.runFlags.group);
    }

    return { tasksFound: [], tasksNotFound: [] };
  }

  private runActions() {
    return new Promise<void>((resolve, reject) => {
      let evaluators = getRegisteredActions();

      for (let [taskName, evaluator] of evaluators) {
        let task = this.pluginTasks.find(taskName);

        let taskResult = this.pluginTaskResults.filter((result: Result) => {
          return result.properties?.taskName === taskName;
        });

        if (task && taskResult.length > 0) {
          try {
            this.actions.push(...evaluator(taskResult, task.config));
          } catch (error) {
            reject(error);
          }
        }
      }

      resolve();
    });
  }

  private async loadConfig() {
    let configPath;

    try {
      configPath =
        (await getConfigPathFromOptions(this.runFlags.config)) || getConfigPath(this.runFlags.cwd);
      this.checkupConfig = readConfig(configPath);

      let plugins = await loadPlugins(this.checkupConfig.plugins, this.runFlags.cwd);

      this.config.plugins.push(...plugins);
    } catch (error) {
      this.extendedError(error);
    }
  }

  protected async register() {
    await this.config.runHook('register-parsers', {
      registerParser,
    });

    await this.config.runHook('register-actions', {
      registerActions,
    });

    await this.config.runHook('register-task-reporter', {
      registerTaskReporter,
    });

    // if excludePaths are provided both via the command line and config, the command line is prioritized
    let excludePaths = this.runFlags['exclude-paths'] || this.checkupConfig.excludePaths;

    this.taskContext = Object.freeze({
      cliArguments: this.runArgs,
      cliFlags: this.runFlags,
      parsers: getRegisteredParsers(),
      config: this.checkupConfig,
      pkg: getPackageJson(this.runFlags.cwd),
      paths: FilePathArray.from(
        await getFilePathsAsync(this.runFlags.cwd, this.runArgs, excludePaths)
      ) as FilePathArray,
    });

    this.registerTasks();

    __tasksForTesting.forEach((task: Task) => {
      this.pluginTasks.registerTask(task);
    });
  }

  protected abstract registerTasks(): void;

  private report(log: Log) {
    let generateReport = getReporter(this.runFlags);

    generateReport(log, this.runFlags);
  }

  private printAvailableTasks() {
    reportAvailableTasks(this.pluginTasks);
  }

  private getInvocation(errors: TaskError[]): Invocation {
    return {
      arguments: this.runArgs,
      executionSuccessful: true,
      endTimeUtc: new Date().toJSON(),
      environmentVariables: {
        cwd: this.runFlags.cwd,
        outputFile: this.runFlags['output-file'],
        format: this.runFlags.format,
      },
      toolExecutionNotifications: buildNotificationsFromTaskErrors(errors),
      startTimeUtc: this.startTime,
    };
  }
}
