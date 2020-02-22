import * as path from 'path';

import { Command, flags } from '@oclif/command';
import { TaskConstructor, TaskList, getPackageJson, getRegisteredTasks, ui } from '@checkup/core';

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
    let registeredTasks: TaskConstructor[];

    try {
      getPackageJson(args.path);
    } catch (e) {
      this.error(
        `The ${path.resolve(
          args.path
        )} directory found through the 'path' option does not contain a package.json file. You must run checkup in a directory with a package.json file.`,
        e
      );
    }

    await this.config.runHook('register-tasks', {});

    registeredTasks = getRegisteredTasks();

    let tasksToBeRun = new TaskList();

    if (flags.task !== undefined) {
      let task = Object.values(registeredTasks).find(
        task => flags.task === task.name.replace('Task', '')
      );

      if (task !== undefined) {
        tasksToBeRun.addTask(task, args);
      }
    } else {
      tasksToBeRun.addTasks(registeredTasks, args);
    }

    ui.action.start('Checking up on your project');
    let taskResults = await tasksToBeRun.runTasks();

    if (!flags.silent) {
      if (flags.json) {
        let resultData = {};
        taskResults.forEach(taskResult => {
          resultData = Object.assign(resultData, taskResult.toJson());
        });

        ui.styledJSON(resultData);
      } else {
        taskResults.forEach(result => {
          result.toConsole();
        });
      }
    }

    ui.action.stop();
  }
}

export = Checkup;
