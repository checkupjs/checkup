import * as path from 'path';

import {
  CheckupConfig,
  CheckupConfigService,
  ReporterType,
  RunArgs,
  RunFlags,
  TaskContext,
  TaskResult,
  getFilepathLoader,
  getPackageJson,
  getRegisteredParsers,
  getSearchLoader,
  loadPlugins,
  registerParser,
  ui,
} from '@checkup/core';
import { Command, flags } from '@oclif/command';

import CheckupMetaTask from '../tasks/checkup-meta-task';
import MetaTaskList from '../meta-task-list';
import { MetaTaskResult } from '../types';
import ProjectMetaTask from '../tasks/project-meta-task';
import TaskList from '../task-list';
import { getReporter } from '../reporters';

export default class RunCommand extends Command {
  static description = 'Provides health check information about your project';

  static args = [
    {
      name: 'path',
      required: true,
      description: 'The path referring to the root directory that Checkup will run in',
      default: '.',
    },
  ];

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' }),
    silent: flags.boolean({ char: 's' }),
    reporter: flags.string({
      char: 'r',
      options: [...Object.values(ReporterType)],
      default: 'stdout',
    }),
    reportOutputPath: flags.string({
      char: 'o',
      default: '.',
    }),
    task: flags.string({ char: 't' }),
    config: flags.string({
      char: 'c',
      description: 'Use this configuration, overriding .checkuprc.* if present',
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

    this.validatePackageJson();

    await this.registerTasks();
    await this.runTasks();
    await this.report();

    ui.action.stop();
  }

  private async registerDefaultTasks(context: TaskContext) {
    let pluginName = 'meta';

    this.defaultTasks.registerTask(new ProjectMetaTask(pluginName, context));
    this.defaultTasks.registerTask(new CheckupMetaTask(pluginName, context));
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
      const configLoader = this.runArgs.config
        ? getFilepathLoader(this.runArgs.config)
        : getSearchLoader(this.runArgs.path);
      const configService = await CheckupConfigService.load(configLoader);

      this.checkupConfig = configService.get();

      let plugins = await loadPlugins(this.checkupConfig.plugins, this.runArgs.path);

      this.config.plugins.push(...plugins);
    } catch (error) {
      this.error(error);
    }
  }

  private validatePackageJson() {
    try {
      getPackageJson(this.runArgs.path);
    } catch (error) {
      this.error(
        `The ${path.resolve(
          this.runArgs.path
        )} directory found through the 'path' option does not contain a package.json file. You must run checkup in a directory with a package.json file.`,
        error
      );
    }
  }

  private async registerTasks() {
    let taskContext: TaskContext;

    await this.config.runHook('register-parsers', {
      registerParser,
    });

    taskContext = {
      cliArguments: this.runArgs,
      cliFlags: this.runFlags,
      parsers: getRegisteredParsers(),
      config: this.checkupConfig,
    };

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
