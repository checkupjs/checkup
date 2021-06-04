import { join } from 'path';
import { BaseTask, Task, DependencyAnalyzer } from '@checkup/core';
import { Result } from 'sarif';

export default class EmberDependenciesTask extends BaseTask implements Task {
  taskName = 'ember-dependencies';
  taskDisplayName = 'Ember Dependencies';
  description = 'Finds Ember-specific dependencies and their versions in an Ember.js project';
  category = 'dependencies';
  group = 'ember';

  async run(): Promise<Result[]> {
    let analyzer = new DependencyAnalyzer(this.context.options.cwd);
    let dependencies = await analyzer.analyze();

    return dependencies
      .filter((dependency) => isEmberDependency(dependency.packageName))
      .map((dependency) => {
        return this.addResult(
          `Ember dependency information for ${dependency.packageName}`,
          'review',
          'note',
          {
            location: {
              uri: join(this.context.options.cwd, 'package.json'),
              startLine: dependency.startLine,
              startColumn: dependency.startColumn,
            },
            properties: {
              packageName: dependency.packageName,
              packageVersion: dependency.packageVersion,
              latestVersion: dependency.latestVersion,
              type: dependency.type,
            },
          }
        );
      });
  }
}

function isEmberDependency(dependency: string) {
  return dependency.startsWith('ember-') && !dependency.startsWith('ember-cli');
}
