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

    await this.runDefaultTasks(args);
    await this.runPluginHooks(args);
    await this.runPluginTasks(flags);
    await this.report(flags);

    ui.action.stop();
  }

  private async runDefaultTasks(cliArguments: any) {
    this.defaultTasks.registerTask(new ProjectMetaTask(cliArguments));
    this.defaultTasks.registerTask(new CheckupMetaTask(cliArguments, this.checkupConfig));

    this.metaTaskResults = await this.defaultTasks.runTasks();
  }

  private async runPluginTasks(flags: any) {
    if (flags.task !== undefined) {
      this.pluginTaskResults = [await this.pluginTasks.runTask(flags.task)];
    } else {
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

  private async runPluginHooks(cliArguments: any) {
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
    if (!flags.silent) {
      let generateReport = getReporter(flags, this.metaTaskResults, this.pluginTaskResults);

      await generateReport();
    }
  }
}
