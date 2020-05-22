import {
  CheckupConfig,
  OutputFormat,
  RunArgs,
  RunFlags,
  TaskContext,
  TaskResult,
  getConfigPath,
  getRegisteredParsers,
  loadPlugins,
  readConfig,
  registerParser,
  ui,
} from '@checkup/core';
import { Command, flags } from '@oclif/command';

import CheckupMetaTask from '../tasks/checkup-meta-task';
import MetaTaskList from '../meta-task-list';
import { MetaTaskResult } from '../types';
import OutdatedDependenciesTask from '../tasks/outdated-dependencies-task';
import ProjectMetaTask from '../tasks/project-meta-task';
import TaskList from '../task-list';
import TodosTask from '../tasks/todos-task';
import { getPackageJson } from '../helpers/get-package-json';
import { getReporter } from '../reporters';

export default class RunCommand extends Command {
  static description = 'Provides health check information about your project';

  static usage = '[run] PATH';

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
    config: flags.string({
      char: 'c',
      description: 'Use this configuration, overriding .checkuprc.* if present',
    }),
    cwd: flags.string({
      default: '.',
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

  runArgs!: RunArgs;
  runFlags!: RunFlags;
  defaultTasks: MetaTaskList = new MetaTaskList();
  metaTaskResults: MetaTaskResult[] = [];
  pluginTasks: TaskList = new TaskList();
  pluginTaskResults: TaskResult[] = [];
  checkupConfig!: CheckupConfig;

  public async init() {
    let { args, flags } = this.parse(RunCommand);

    this.runArgs = args;
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
    this.defaultTasks.registerTask(new CheckupMetaTask(pluginName, context));

    // TODO: figure out where to put this. Internal? External?
    this.pluginTasks.registerTask(new TodosTask(pluginName, context));
    this.pluginTasks.registerTask(new OutdatedDependenciesTask(pluginName, context));
  }

  private async runTasks() {
    if (this.runFlags.task !== undefined) {
      let taskFound: boolean = false;

      if (this.defaultTasks.hasTask(this.runFlags.task)) {
        taskFound = true;
        this.metaTaskResults = [await this.defaultTasks.runTask(this.runFlags.task)];
      }

      if (this.pluginTasks.hasTask(this.runFlags.task)) {
        taskFound = true;
        this.pluginTaskResults = [await this.pluginTasks.runTask(this.runFlags.task)];
      }

      if (!taskFound) {
        this.error(`Cannot find the ${this.runFlags.task} task.`);
      }
    } else {
      this.metaTaskResults = await this.defaultTasks.runTasks();
      this.pluginTaskResults = await this.pluginTasks.runTasks();
    }
  }

  private async loadConfig() {
    try {
      this.checkupConfig = readConfig(this.runFlags.config || getConfigPath(this.runFlags.cwd));
    } catch (error) {
      this.error(
        `Could not find a checkup configuration starting from the given path: ${this.runFlags.cwd}. See https://docs.checkupjs.com/quickstart/usage#1-generate-a-configuration-file for more info on how to setup a configuration.`
      );
    }

    try {
      let plugins = await loadPlugins(this.checkupConfig.plugins, this.runFlags.cwd);

      this.config.plugins.push(...plugins);
    } catch (error) {
      this.error(error);
    }
  }

  private async registerTasks() {
    let taskContext: TaskContext;

    await this.config.runHook('register-parsers', {
      registerParser,
    });

    taskContext = Object.freeze({
      cliArguments: this.runArgs,
      cliFlags: this.runFlags,
      parsers: getRegisteredParsers(),
      config: this.checkupConfig,
      pkg: getPackageJson(this.runFlags.cwd),
    });

    await this.registerDefaultTasks(taskContext);

    await this.config.runHook('register-tasks', {
      context: taskContext,
      tasks: this.pluginTasks,
    });
  }

  private async report() {
    let generateReport = getReporter(this.runFlags, this.metaTaskResults, this.pluginTaskResults);

    await generateReport();
  }
}
