import { ui } from './utils/ui';
import { TaskConstructor, TaskResult } from './types';
import { getTaskByName } from './utils/default-tasks';
import TaskList from './task-list';
import * as DefaultTasks from './tasks';

const DEFAULT_TASKS = <TaskConstructor[]>(
  Object.values(DefaultTasks).filter(x => typeof x == 'function')
);

/**
 * @class Checkup
 *
 * The entry point for invoking all checkup tasks.
 */
export default class Checkup {
  args: any;
  flags: any;
  defaultTasks: TaskConstructor[];

  /**
   *
   * @param ui {IUserInterface} the UI model that is instantiated as part of ember-cli.
   */
  constructor(args: any, flags: any, tasks: TaskConstructor[] = DEFAULT_TASKS) {
    this.args = args;
    this.flags = flags;
    this.defaultTasks = tasks;
  }

  /**
   * @method run
   *
   * Gathers and runs all tasks associated with checking up on an Ember repo.
   */
  async run(): Promise<TaskResult[]> {
    ui.clearScreen();

    let tasks = new TaskList();

    if (this.flags.task !== undefined) {
      let task = getTaskByName(this.flags.task);

      tasks.addTask(task);
    } else {
      tasks.addTasks(this.defaultTasks);
    }

    ui.action.start('Checking up on your project');
    let taskResults = await tasks.runTasks();
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
