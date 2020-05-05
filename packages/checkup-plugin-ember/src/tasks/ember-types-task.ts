import { Category, FileSearcherTask, Priority, Task, TaskContext, TaskResult } from '@checkup/core';

import EmberTypesTaskResult from '../results/ember-types-task-result';

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

export default class EmberTypesTask extends FileSearcherTask implements Task {
  meta = {
    taskName: 'types',
    friendlyTaskName: 'Project Types',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.High,
    },
  };

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context, SEARCH_PATTERNS);
  }

  async run(): Promise<TaskResult> {
    let result = new EmberTypesTaskResult(this.meta);
    result.types = await this.searcher.search();

    return result;
  }
}
