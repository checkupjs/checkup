import { TaskMetaData } from './types/tasks';
import { TaskConfig } from './types/config';

export default abstract class BaseTaskResult {
  constructor(public meta: TaskMetaData, public config: TaskConfig) {}
}
