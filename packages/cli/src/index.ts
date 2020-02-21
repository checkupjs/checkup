import { Command, flags } from '@oclif/command';
import { TaskConstructor, TaskList, getRegisteredTasks, ui } from '@checkup/core';

class Checkup extends Command {
  static description = 'A CLI that provides health check information about your project';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' }),
    silent: flags.boolean({ char: 's' }),
    json: flags.boolean(),
    task: flags.string({ char: 't' }),
  };

  async run() {
    let { flags } = this.parse(Checkup);
    let registeredTasks: TaskConstructor[];

    await this.config.runHook('register-tasks', {});

    registeredTasks = getRegisteredTasks();

    let tasksToBeRun = new TaskList();

    if (flags.task !== undefined) {
      let task = Object.values(registeredTasks).find(
        task => flags.task === task.name.replace('Task', '')
      );

      if (task !== undefined) {
        tasksToBeRun.addTask(task);
      }
    } else {
      tasksToBeRun.addTasks(registeredTasks);
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
