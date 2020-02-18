import { TaskConstructor, TaskList, TaskResult, getRegisteredTasks, ui } from '@checkup/core';

/**
 * @class Checkup
 *
 * The entry point for invoking all checkup tasks.
 */
export default class Checkup {
  args: any;
  flags: any;
  registeredTasks: TaskConstructor[];

  /**
   *
   * @param args Additional arguments passed to the CLI
   * @param flags Flags passed to the CLI
   * @param registeredTasks The set of registered tasks that are configured to run for the CLI
   */
  constructor(args: any, flags: any, registeredTasks: TaskConstructor[] = getRegisteredTasks()) {
    this.args = args;
    this.flags = flags;
    this.registeredTasks = registeredTasks;
  }

  /**
   * @method run
   *
   * Runs all tasks associated with checking up on an Ember repo.
   */
  async run(): Promise<TaskResult[]> {
    ui.clearScreen();

    let tasksToBeRun = new TaskList();

    if (this.flags.task !== undefined) {
      let task = Object.values(this.registeredTasks).find(
        task => this.flags.task === task.name.replace('Task', '')
      );

      if (task !== undefined) {
        tasksToBeRun.addTask(task);
      }
    } else {
      tasksToBeRun.addTasks(this.registeredTasks);
    }

    ui.action.start('Checking up on your project');
    let taskResults = await tasksToBeRun.runTasks();
    ui.action.stop();
    ui.clearLine();

    if (!this.flags.silent) {
      if (this.flags.json) {
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

    return taskResults;
  }
}
