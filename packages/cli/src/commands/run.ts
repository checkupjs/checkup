import {
  CheckupConfig,
  CheckupError,
  OutputFormat,
  RunFlags,
  Task,
  TaskContext,
  TaskError,
  Action,
  loadPlugins,
  registerParser,
  registerActions,
  registerTaskReporter,
  getFilePathsAsync,
  getConfigPath,
  getConfigPathFromOptions,
  readConfig,
  getRegisteredParsers,
  getRegisteredActions,
  ui,
  buildNotificationsFromTaskErrors,
  FilePathArray,
} from '@checkup/core';

import { flags } from '@oclif/command';
import { BaseCommand } from '../base-command';
import MetaTaskList from '../meta-task-list';
import { MetaTaskResult } from '../types';
import TaskList from '../task-list';
import { getPackageJson } from '../utils/get-package-json';
import { getReporter } from '../reporters/get-reporter';
import ProjectMetaTask from '../tasks/project-meta-task';
import { getLog } from '../get-log';
import { reportAvailableTasks } from '../reporters/available-task-reporter';
import { Invocation, Log, Result } from 'sarif';
import { TASK_ERRORS } from '../task-errors';

let __tasksForTesting: Set<Task> = new Set<Task>();

export function _registerTaskForTesting(task: Task) {
  __tasksForTesting.add(task);
}
export function _resetTasksForTesting() {
  __tasksForTesting = new Set<Task>();
}

export default class RunCommand extends BaseCommand {
  static description = 'A health checkup for your project';

  // required for variable length command line arguments
  static strict = false;

  static usage = '[run] PATHS';

  static args = [
    {
      name: 'paths',
      description:
        'The paths that checkup will operate on. If no paths are provided, checkup will run on the entire directory beginning at --cwd.',
    },
  ];

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    excludePaths: flags.string({
      description:
        'Paths to exclude from checkup. If paths are provided via command line and via checkup config, command line paths will be used.',
      char: 'e',
      multiple: true,
    }),
    config: flags.string({
      char: 'c',
      description: 'Use this configuration, overriding .checkuprc.* if present.',
    }),
    cwd: flags.string({
      default: () => process.cwd(),
      char: 'd',
      description: 'The path referring to the root directory that Checkup will run in',
    }),
    category: flags.string({
      description: 'Runs specific tasks specified by category. Can be used multiple times.',
      multiple: true,
      exclusive: ['group', 'task'],
    }),
    group: flags.string({
      description: 'Runs specific tasks specified by group. Can be used multiple times.',
      multiple: true,
      exclusive: ['category', 'task'],
    }),
    task: flags.string({
      char: 't',
      description:
        'Runs specific tasks specified by the fully qualified task name in the format pluginName/taskName. Can be used multiple times.',
      multiple: true,
      exclusive: ['category', 'group'],
    }),
    format: flags.string({
      char: 'f',
      options: [...Object.values(OutputFormat)],
      default: 'stdout',
      description: `The output format, one of ${[...Object.values(OutputFormat)].join(', ')}`,
    }),
    outputFile: flags.string({
      char: 'o',
      default: '',
      description:
        'Specify file to write JSON output to. Requires the `--format` flag to be set to `json`',
    }),
    listTasks: flags.boolean({
      char: 'l',

      description: 'List all available tasks to run.',
    }),
    verbose: flags.boolean({
      exclusive: ['format'],
    }),
  };

  runArgs!: string[];
  runFlags!: RunFlags;
  defaultTasks: MetaTaskList = new MetaTaskList();
  metaTaskResults: MetaTaskResult[] = [];
  metaTaskErrors: TaskError[] = [];
  pluginTasks: TaskList = new TaskList();
  pluginTaskResults: Result[] = [];
  pluginTaskErrors: TaskError[] = [];
  startTime: string = '';
  actions: Action[] = [];
  checkupConfig!: CheckupConfig;
  executedTasks!: Task[];
  cliModeEnabled: boolean = true;

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

  public async init() {
    let { argv, flags } = this.parse(RunCommand);

    if (flags.outputFile && flags.format !== OutputFormat.json) {
      this.error(
        new Error(
          'Missing --format flag. --format=json must also be provided when using --outputFile'
        )
      );
    }
    this.startTime = new Date().toJSON();
    this.runArgs = argv;
    this.runFlags = flags;
    this.cliModeEnabled = process.env.CHECKUP_CLI === '1';
  }

  public async run() {
    await this.loadConfig();

    await this.register();

    if (this.runFlags.listTasks) {
      this.printAvailableTasks();
    } else {
      if (this.cliModeEnabled) {
        ui.action.start('Checking up on your project');
      }

      await this.runTasks();
      await this.runActions();

      let errors = [...this.metaTaskErrors, ...this.pluginTaskErrors];

      let log: Log = getLog(
        this.metaTaskResults,
        this.pluginTaskResults,
        this.actions,
        this.getInvocation(errors),
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

  private async registerDefaultTasks(context: TaskContext) {
    let pluginName = 'meta';

    this.defaultTasks.registerTask(new ProjectMetaTask(pluginName, context));
  }

  private async runTasks() {
    [this.metaTaskResults, this.metaTaskErrors] = await this.defaultTasks.runTasks();

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
    return new Promise((resolve, reject) => {
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

  private async register() {
    let taskContext: TaskContext;

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
    let excludePaths = this.runFlags.excludePaths || this.checkupConfig.excludePaths;

    taskContext = Object.freeze({
      cliArguments: this.runArgs,
      cliFlags: this.runFlags,
      parsers: getRegisteredParsers(),
      config: this.checkupConfig,
      pkg: getPackageJson(this.runFlags.cwd),
      paths: FilePathArray.from(
        await getFilePathsAsync(this.runFlags.cwd, this.runArgs, excludePaths)
      ) as FilePathArray,
    });

    await this.registerDefaultTasks(taskContext);

    await this.config.runHook('register-tasks', {
      context: taskContext,
      tasks: this.pluginTasks,
    });

    __tasksForTesting.forEach((task: Task) => {
      this.pluginTasks.registerTask(task);
    });
  }

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
        outputFile: this.runFlags.outputFile,
        format: this.runFlags.format,
      },
      toolExecutionNotifications: buildNotificationsFromTaskErrors(errors),
      startTimeUtc: this.startTime,
    };
  }
}
