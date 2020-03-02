import * as path from 'path';

import { Command, flags } from '@oclif/command';
import { TaskResult, getConfig, getPackageJson, loadPlugins, ui } from '@checkup/core';
import { getRegisteredParsers, registerParser } from './parsers';

import TaskList from './task-list';

/**
 * @param taskResults
 */
function mergeTaskResults(taskResults: TaskResult[]) {
  let mergedResults = {};

  taskResults.forEach(taskResult => {
    mergedResults = Object.assign(mergedResults, taskResult.toJson());
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
    json: flags.boolean(),
    task: flags.string({ char: 't' }),
  };

  async run() {
    let { args, flags } = this.parse(Checkup);
    let taskResults: TaskResult[];
    let registeredTasks: TaskList = new TaskList();

    try {
      let checkupConfig = await getConfig(args.path);
      let plugins = await loadPlugins(checkupConfig.plugins, args.path);
      this.config.plugins.push(...plugins);
    } catch (error) {
      this.error(error);
    }

    try {
      getPackageJson(args.path);
    } catch (error) {
      this.error(
        `The ${path.resolve(
          args.path
        )} directory found through the 'path' option does not contain a package.json file. You must run checkup in a directory with a package.json file.`,
        error
      );
    }

    await this.config.runHook('register-parsers', {
      registerParser,
    });

    await this.config.runHook('register-tasks', {
      cliArguments: args,
      cliFlags: flags,
      parsers: getRegisteredParsers(),
      tasks: registeredTasks,
    });

    if (flags.task !== undefined) {
      taskResults = [await registeredTasks.runTask(flags.task)];
    } else {
      taskResults = await registeredTasks.runTasks();
    }

    ui.action.start('Checking up on your project');

    if (!flags.silent) {
      if (flags.json) {
        ui.styledJSON(mergeTaskResults(taskResults));
      } else {
        taskResults.forEach(taskResult => taskResult.toConsole());
      }
    }

    ui.action.stop();
  }
}

export = Checkup;
