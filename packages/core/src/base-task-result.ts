import { Task, TaskMetaData } from './types';

export default abstract class BaseTaskResult {
  meta: TaskMetaData;

  constructor(task: Task) {
    this.meta = {
      taskName: task.taskName,
      friendlyTaskName: task.friendlyTaskName,
    };
  }
}
