import { TaskMetaData } from './types';

export default abstract class BaseTaskResult {
  meta: TaskMetaData;

  constructor(meta: TaskMetaData) {
    this.meta = meta;
  }
}
