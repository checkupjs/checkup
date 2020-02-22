import { Task, TaskResult } from './types';

export default abstract class BaseTask implements Task {
  args: any;

  constructor(args: any) {
    this.args = args;
  }

  abstract run(): Promise<TaskResult>;
}
