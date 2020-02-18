import { TaskConstructor, TaskList, TaskResult, getTasks, ui } from '@checkup/core';

/**
 * @class Checkup
 *
 * The entry point for invoking all checkup tasks.
 */
export default class Checkup {
  args: any;
  flags: any;
  tasks: TaskConstructor[];

  /**
   *
   * @param ui {IUserInterface} the UI model that is instantiated as part of ember-cli.
   */
  constructor(args: any, flags: any, tasks: TaskConstructor[] = getTasks()) {
    this.args = args;
    this.flags = flags;
    this.tasks = tasks;
  }

  /**
   * @method run
   *
   * Gathers and runs all tasks associated with checking up on an Ember repo.
   */
  async run(): Promise<TaskResult[]> {
    ui.clearScreen();

    let tasksToBeRun = new TaskList();

    if (this.flags.task !== undefined) {
      let task = Object.values(this.tasks).find(
        task => this.flags.task === task.name.replace('Task', '')
      );

      if (task !== undefined) {
        tasksToBeRun.addTask(task);
      }
    } else {
      tasksToBeRun.addTasks(this.tasks);
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
