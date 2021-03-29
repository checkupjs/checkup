import { Task, BaseTask, trimAllCwd, sarifBuilder } from '@checkup/core';
import { Result } from 'sarif';

const SEARCH_PATTERNS = [
  { patternName: 'components', pattern: ['**/components/**/*.js'] },
  { patternName: 'controllers', pattern: ['**/controllers/**/*.js'] },
  { patternName: 'helpers', pattern: ['**/helpers/**/*.js'] },
  { patternName: 'initializers', pattern: ['**/initializers/**/*.js'] },
  { patternName: 'instance-initializers', pattern: ['**/instance-initializers/**/*.js'] },
  { patternName: 'mixins', pattern: ['**/mixins/**/*.js'] },
  { patternName: 'models', pattern: ['**/models/**/*.js'] },
  { patternName: 'routes', pattern: ['**/routes/**/*.js'] },
  { patternName: 'services', pattern: ['**/services/**/*.js'] },
  { patternName: 'templates', pattern: ['**/templates/**/*.hbs'] },
];

export default class EmberTypesTask extends BaseTask implements Task {
  taskName = 'ember-types';
  taskDisplayName = 'Ember Types';
  category = 'metrics';
  group = 'ember';

  async run(): Promise<Result[]> {
    let types = SEARCH_PATTERNS.flatMap((pattern) => {
      let files = this.context.paths.filterByGlob(pattern.pattern);
      return sarifBuilder.fromLocations(
        this,
        trimAllCwd(files, this.context.options.cwd),
        pattern.patternName
      );
    });

    return types;
  }
}
