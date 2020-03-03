import {
  BaseTask,
  Category,
  FileSearcherTask,
  Priority,
  TaskClassification,
  TaskName,
  TaskResult,
} from '@checkup/core';

import { TypesTaskResult } from '../results';

const SEARCH_PATTERNS = {
  components: ['**/components/**/*.js'],
  controllers: ['**/controllers/**/*.js'],
  helpers: ['**/helpers/**/*.js'],
  initializers: ['**/initializers/**/*.js'],
  'instance-initializers': ['**/instance-initializers/**/*.js'],
  mixins: ['**/mixins/**/*.js'],
  models: ['**/models/**/*.js'],
  routes: ['**/routes/**/*.js'],
  services: ['**/services/**/*.js'],
  templates: ['**/templates/**/*.hbs'],
};

export default class TypesTask extends FileSearcherTask implements BaseTask {
  taskName: TaskName = 'types';
  friendlyTaskName: TaskName = 'Project Types';
  taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.Medium,
  };

  constructor(cliArguments: any) {
    super(cliArguments, SEARCH_PATTERNS);
  }

  async run(): Promise<TaskResult> {
    let result = new TypesTaskResult(this);
    result.types = await this.searcher.search();

    return result;
  }
}
