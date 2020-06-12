import { TaskMetaData } from './types/tasks';
import { TaskConfig } from './types/config';
import ActionList from './action-list';

export default abstract class BaseTaskResult {
  actionList!: ActionList;
  constructor(public meta: TaskMetaData, public config: TaskConfig) {}
}
