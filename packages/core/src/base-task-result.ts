import { TaskMetaData } from './types/tasks';
import { ActionConfig } from './types/config';
import ActionList from './action-list';

export default abstract class BaseTaskResult {
  actionList!: ActionList;
  constructor(public meta: TaskMetaData, public config: ActionConfig[]) {}
}
