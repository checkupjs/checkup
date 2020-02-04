import { ITask, ITaskResult } from '../types';

import FileSearcherTask from '../file-searcher-task';
import { TypesTaskResult } from '../results';

export default class TypesTask extends FileSearcherTask implements ITask {
  constructor() {
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

    super(SEARCH_PATTERNS);
  }

  async run(): Promise<ITaskResult> {
    let result = new TypesTaskResult();
    result.types = await this.searcher.search();

    return result;
  }
}
