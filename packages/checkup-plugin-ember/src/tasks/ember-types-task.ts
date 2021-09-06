import { Task, BaseTask, trimCwd } from '@checkup/core';
import { Result } from 'sarif';

const SEARCH_PATTERNS = [
  { type: 'components', pattern: ['**/components/**/*.js'] },
  { type: 'controllers', pattern: ['**/controllers/**/*.js'] },
  { type: 'helpers', pattern: ['**/helpers/**/*.js'] },
  { type: 'initializers', pattern: ['**/initializers/**/*.js'] },
  { type: 'instance-initializers', pattern: ['**/instance-initializers/**/*.js'] },
  { type: 'mixins', pattern: ['**/mixins/**/*.js'] },
  { type: 'models', pattern: ['**/models/**/*.js'] },
  { type: 'routes', pattern: ['**/routes/**/*.js'] },
  { type: 'services', pattern: ['**/services/**/*.js'] },
  { type: 'templates', pattern: ['**/templates/**/*.hbs'] },
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
          `Located ${pattern.type.slice(0, Math.max(0, pattern.type.length - 1))} at ${uri}`,
          'informational',
          'note',
          {
            location: {
              uri,
            },
            properties: {
              type: pattern.type,
            },
            rule: {
              properties: {
                component: {
                  name: 'list',
                  options: {
                    items: SEARCH_PATTERNS.reduce((total, pattern) => {
                      total[pattern.type] = {
                        groupBy: 'properties.type',
                        value: pattern.type,
                      };
                      return total;
                    }, {} as Record<string, any>),
                  },
                },
              },
            },
          }
        );
      });
    });

    return this.results;
  }
}
