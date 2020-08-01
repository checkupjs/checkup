import {
  CheckupConfig,
  CheckupError,
  OutputFormat,
  RunFlags,
  TaskContext,
  TaskError,
  TaskResult,
  getConfigPath,
  getRegisteredParsers,
  loadPlugins,
  readConfig,
  registerParser,
  ui,
  getFilePaths,
} from '@checkup/core';

import { BaseCommand } from '../base-command';
import MetaTaskList from '../meta-task-list';
import { MetaTaskResult } from '../types';
import TaskList from '../task-list';
import { flags } from '@oclif/command';
import { getPackageJson } from '../helpers/get-package-json';
import { getReporter } from '../reporters';
import LinesOfCodeTask from '../tasks/lines-of-code-task';
import ProjectMetaTask from '../tasks/project-meta-task';

export default class RunCommand extends BaseCommand {
  static description = 'Provides health check information about your project';

  // required for variable length command line arguments
  static strict = false;

  static usage = '[run] PATHS';

  static args = [
    {
      name: 'paths',
      description:
        'The paths that checkup will operate on. If no paths are provided, checkup will run on the entire directory beginning at --cwd',
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
      description: 'Use this configuration, overriding .checkuprc.* if present',
    }),
    cwd: flags.string({
      default: () => process.cwd(),
      char: 'd',
      description: 'The path referring to the root directory that Checkup will run in',
    }),
    task: flags.string({ char: 't' }),
    format: flags.string({
      char: 'f',
      options: [...Object.values(OutputFormat)],
      default: 'stdout',
      description: `The output format, one of ${[...Object.values(OutputFormat)].join(', ')}`,
    }),
    outputFile: flags.string({
      char: 'o',
      default: '',
      description: 'Specify file to write report to',
    }),
  };

  runArgs!: string[];
  runFlags!: RunFlags;
  defaultTasks: MetaTaskList = new MetaTaskList();
  metaTaskResults: MetaTaskResult[] = [];
  metaTaskErrors: TaskError[] = [];
  pluginTasks: TaskList = new TaskList();
  pluginTaskResults: TaskResult[] = [];
  pluginTaskErrors: TaskError[] = [];
  checkupConfig!: CheckupConfig;

  public async init() {
    let { argv, flags } = this.parse(RunCommand);

    this.runArgs = argv;
    this.runFlags = flags;
  }

  public async run() {
    ui.action.start('Checking up on your project');

    await this.loadConfig();

    await this.registerTasks();
    await this.runTasks();
    await this.report();

    ui.action.stop();
  }

  private async registerDefaultTasks(context: TaskContext) {
    let pluginName = 'meta';

    this.defaultTasks.registerTask(new ProjectMetaTask(pluginName, context));

    // TODO: figure out where to put this. Internal? External?
    this.pluginTasks.registerTask(new LinesOfCodeTask(pluginName, context));
  }

  private async runTasks() {
    [this.metaTaskResults, this.metaTaskErrors] = await this.defaultTasks.runTasks();

    if (this.runFlags.task !== undefined) {
      let pluginTaskResult: TaskResult | undefined;
      let taskFound: boolean = false;

      if (this.pluginTasks.hasTask(this.runFlags.task)) {
        taskFound = true;

        [pluginTaskResult, this.pluginTaskErrors] = await this.pluginTasks.runTask(
          this.runFlags.task
        );

        if (pluginTaskResult) {
          this.pluginTaskResults.push(pluginTaskResult);
        }
      }

      if (!taskFound) {
        this.extendedError(
          new CheckupError(
            `Cannot find the ${this.runFlags.task} task.`,
            "Make sure you've provided the correct task name."
          )
        );
      }
    } else {
      [this.pluginTaskResults, this.pluginTaskErrors] = await this.pluginTasks.runTasks();
    }
  }

  private async loadConfig() {
    let configPath;

    try {
      configPath = this.runFlags.config || getConfigPath(this.runFlags.cwd);
      this.checkupConfig = readConfig(configPath);

      let plugins = await loadPlugins(this.checkupConfig.plugins, this.runFlags.cwd);

      this.config.plugins.push(...plugins);
    } catch (error) {
      this.extendedError(error);
    }
  }

  private async registerTasks() {
    let taskContext: TaskContext;

    await this.config.runHook('register-parsers', {
      registerParser,
    });

    // if excludePaths are provided both via the command line and config, the command line is prioritized
    let excludePaths = this.runFlags.excludePaths || this.checkupConfig.excludePaths;

    taskContext = Object.freeze({
      cliArguments: this.runArgs,
      cliFlags: this.runFlags,
      parsers: getRegisteredParsers(),
      config: this.checkupConfig,
      pkg: getPackageJson(this.runFlags.cwd),
      paths: getFilePaths(this.runFlags.cwd, this.runArgs, excludePaths),
    });

    await this.registerDefaultTasks(taskContext);

    await this.config.runHook('register-tasks', {
      context: taskContext,
      tasks: this.pluginTasks,
    });
  }

  private async report() {
    let errors = [...this.metaTaskErrors, ...this.pluginTaskErrors];
    let generateReport = getReporter(
      this.runFlags,
      this.metaTaskResults,
      this.pluginTaskResults,
      errors
    );

    await generateReport();
  }
}
