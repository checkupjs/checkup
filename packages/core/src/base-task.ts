import { Task, TaskName, TaskResult } from './types';

export default abstract class BaseTask implements Task {
  static taskName: TaskName;
  static friendlyTaskName: TaskName;

  args: any;

  constructor(cliArguments: any) {
    this.args = cliArguments;
  }

  abstract run(): Promise<TaskResult>;
}
