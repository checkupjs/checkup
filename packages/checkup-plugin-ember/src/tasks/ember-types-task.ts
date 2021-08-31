import { Task, BaseTask, trimCwd } from '@checkup/core';
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
  description = 'Gets a breakdown of all Ember types in an Ember.js project';
  category = 'metrics';
  group = 'ember';

  async run(): Promise<Result[]> {
    SEARCH_PATTERNS.map((pattern) => {
      let files = this.context.paths.filterByGlob(pattern.pattern);

      files.forEach((file: string) => {
        let uri = trimCwd(file, this.context.options.cwd);
        this.addResult(
          `Located ${pattern.patternName.slice(
            0,
            Math.max(0, pattern.patternName.length - 1)
          )} at ${uri}`,
          'informational',
          'note',
          {
            location: {
              uri,
            },
            rule: {
              properties: {
                component: 'table',
              },
            },
          }
        );
      });
    });

    return this.results;
  }
}
