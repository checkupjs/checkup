import { Task, TaskName, TaskResult } from './types';

export default abstract class BaseTask implements Task {
  static taskName: TaskName;
  static friendlyTaskName: TaskName;

  args: any;

  constructor(args: any) {
    this.args = args;
  }

  abstract run(): Promise<TaskResult>;
}
