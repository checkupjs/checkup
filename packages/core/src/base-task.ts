import { Task, TaskClassification, TaskName, TaskResult } from './types';

export default abstract class BaseTask implements Task {
  abstract taskName: TaskName;
  abstract friendlyTaskName: TaskName;
  abstract taskClassification: TaskClassification;

  args: any;

  constructor(cliArguments: any) {
    this.args = cliArguments;
  }

  abstract run(): Promise<TaskResult>;
}
