import * as path from 'path';

import {
  CheckupConfig,
  CheckupConfigService,
  ReporterType,
  TaskResult,
  getFilepathLoader,
  getPackageJson,
  getSearchLoader,
  loadPlugins,
  ui,
} from '@checkup/core';
import { Command, flags } from '@oclif/command';
import { getRegisteredParsers, registerParser } from '../parsers';

import CheckupMetaTask from '../tasks/checkup-meta-task';
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

  defaultTasks: TaskList = new TaskList();
  metaTaskResults: TaskResult[] = [];
  pluginTasks: TaskList = new TaskList();
  pluginTaskResults: TaskResult[] = [];
  checkupConfig!: CheckupConfig;

  async run() {
    let { args, flags } = this.parse(RunCommand);

    ui.action.start('Checking up on your project');

    await this.loadConfig(flags.config, args.path);

    this.validatePackageJson(args.path);

    await this.registerTasks(args);
    await this.runTasks(flags);
    await this.report(flags);

    ui.action.stop();
  }

  private async registerDefaultTasks(cliArguments: any) {
    this.defaultTasks.registerTask(new ProjectMetaTask(cliArguments));
    this.defaultTasks.registerTask(new CheckupMetaTask(cliArguments, this.checkupConfig));
  }

  private async runTasks(flags: any) {
    if (flags.task !== undefined) {
      let taskFound: boolean = false;

      if (this.defaultTasks.hasTask(flags.task)) {
        taskFound = true;
        this.metaTaskResults = [await this.defaultTasks.runTask(flags.task)];
      }

      if (this.pluginTasks.hasTask(flags.task)) {
        taskFound = true;
        this.pluginTaskResults = [await this.pluginTasks.runTask(flags.task)];
      }

      if (!taskFound) {
        this.error(`Cannot find the ${flags.task} task.`);
      }
    } else {
      this.metaTaskResults = await this.defaultTasks.runTasks();
      this.pluginTaskResults = await this.pluginTasks.runTasks();
    }
  }

  private async loadConfig(configFlag: any, pathArgument: string) {
    try {
      const configLoader = configFlag
        ? getFilepathLoader(configFlag)
        : getSearchLoader(pathArgument);
      const configService = await CheckupConfigService.load(configLoader);

      this.checkupConfig = configService.get();

      let plugins = await loadPlugins(this.checkupConfig.plugins, pathArgument);

      this.config.plugins.push(...plugins);
    } catch (error) {
      this.error(error);
    }
  }

  private validatePackageJson(pathArgument: string) {
    try {
      getPackageJson(pathArgument);
    } catch (error) {
      this.error(
        `The ${path.resolve(
          pathArgument
        )} directory found through the 'path' option does not contain a package.json file. You must run checkup in a directory with a package.json file.`,
        error
      );
    }
  }

  private async registerTasks(cliArguments: any) {
    await this.registerDefaultTasks(cliArguments);

    await this.config.runHook('register-parsers', {
      registerParser,
    });

    await this.config.runHook('register-tasks', {
      cliArguments: cliArguments,
      cliFlags: flags,
      parsers: getRegisteredParsers(),
      tasks: this.pluginTasks,
    });
  }

  private async report(flags: any) {
    let generateReport = getReporter(flags, this.metaTaskResults, this.pluginTaskResults);

    await generateReport();
  }
}
