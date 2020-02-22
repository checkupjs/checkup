import { Task, TaskResult } from './types';

// import { titleCase } from 'title-case';

export default abstract class BaseTask implements Task {
  static taskName: string;
  static friendlyTaskName: string;

  args: any;

  constructor(args: any) {
    this.args = args;
  }

  abstract run(): Promise<TaskResult>;
}
