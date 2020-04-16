import { TaskMetaData } from './types/tasks';

export default abstract class BaseTaskResult {
  meta: TaskMetaData;

  constructor(meta: TaskMetaData) {
    this.meta = meta;
  }
}
