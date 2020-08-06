import { TaskMetaData } from './types/tasks';
import { TaskConfig } from './types/config';

export default abstract class BaseTaskResult {
  abstract data: Record<string, any>;

  constructor(public meta: TaskMetaData, public config: TaskConfig) {}

  toJson() {
    return {
      info: this.meta,
      result: this.data,
    };
  }
}
