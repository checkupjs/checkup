import * as path from 'path';

import {
  Category,
  CheckupConfigService,
  Priority,
  TaskResult,
  ReporterType,
  getFilepathLoader,
  getPackageJson,
  getSearchLoader,
  loadPlugins,
  ui,
} from '@checkup/core';
import { Command, flags } from '@oclif/command';
import { getRegisteredParsers, registerParser } from '../parsers';

import TaskList from '../task-list';
import { generateReport } from '../helpers/pdf';

function mergeTaskResults(
  taskResults: TaskResult[],
  resultFormat: ReporterType = ReporterType.json
) {
  let mergedResults: any = {
    [Category.Core]: {
      [Priority.High]: [],
      [Priority.Medium]: [],
      [Priority.Low]: [],
    },
  };
  taskResults.forEach(taskResult => {
    let result = taskResult[resultFormat]();
    if (result) {
      let { category, priority } = result.meta.taskClassification;
      mergedResults[category][priority].push(result);
    }
  });

  return mergedResults;
}

class Checkup extends Command {
  static description = 'A CLI that provides health check information about your project';

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

  tasks: TaskList = new TaskList();
  taskResults: TaskResult[] = [];

  async run() {
    let { args, flags } = this.parse(Checkup);

    ui.action.start('Checking up on your project');

    await this.loadConfig(flags.config, args.path);

    this.validatePackageJson(args.path);

    await this.runHooks(args);

    if (flags.task !== undefined) {
      this.taskResults = [await this.tasks.runTask(flags.task)];
    } else {
      this.taskResults = await this.tasks.runTasks();
    }

    await this.outputResults(flags);

    ui.action.stop();
  }

  private async loadConfig(configFlag: any, pathArgument: string) {
    try {
      const configLoader = configFlag
        ? getFilepathLoader(configFlag)
        : getSearchLoader(pathArgument);
      const configService = await CheckupConfigService.load(configLoader);
      const checkupConfig = configService.get();
      let plugins = await loadPlugins(checkupConfig.plugins, pathArgument);
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

  private async runHooks(cliArguments: any) {
    await this.config.runHook('register-parsers', {
      registerParser,
    });

    await this.config.runHook('register-tasks', {
      cliArguments: cliArguments,
      cliFlags: flags,
      parsers: getRegisteredParsers(),
      tasks: this.tasks,
    });
  }

  private async outputResults(flags: any) {
    if (!flags.silent) {
      if (flags.reporter === ReporterType.pdf) {
        let resultsForPdf = mergeTaskResults(this.taskResults, ReporterType.pdf);
        let reportPath = await generateReport(flags.reportOutputPath, resultsForPdf);

        ui.log(reportPath);
      } else if (flags.reporter === ReporterType.json) {
        let resultJson = mergeTaskResults(this.taskResults, ReporterType.json);
        ui.styledJSON(resultJson);
      } else {
        this.taskResults.forEach(taskResult => taskResult.stdout());
      }
    }
  }
}

export = Checkup;
