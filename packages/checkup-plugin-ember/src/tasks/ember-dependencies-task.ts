import { join } from 'path';
import { BaseTask, Task, JsonAnalyzer } from '@checkup/core';
import { Result } from 'sarif';

interface Dependency {
  packageName: string;
  version: string;
  type: 'dependency' | 'devDependency';
  startLine: number;
  startColumn: number;
}

export default class EmberDependenciesTask extends BaseTask implements Task {
  taskName = 'ember-dependencies';
  taskDisplayName = 'Ember Dependencies';
  description = 'Finds Ember-specific dependencies and their versions in an Ember.js project';
  category = 'dependencies';
  group = 'ember';

  async run(): Promise<Result[]> {
    let dependencies = this.getDependencies();

    return [...dependencies].map((dependency) => {
      return {
        ruleId: this.taskName,
        message: {
          text: `Ember dependency information for ${dependency.packageName}`,
        },
        kind: 'review',
        level: 'note',
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: join(this.context.options.cwd, 'package.json'),
              },
              region: {
                startLine: dependency.startLine,
                startColumn: dependency.startColumn,
              },
            },
          },
        ],
        properties: {
          packageName: dependency.packageName,
          version: dependency.version,
          type: dependency.type,
        },
      };
    });
  }

  getDependencies() {
    class DependenciesAccumulator {
      dependencies: Set<Dependency>;

      constructor() {
        this.dependencies = new Set();
      }

      get visitors() {
        let self = this;
        return {
          ObjectProperty(path: any) {
            let node: any = path.node;
            if (node.key.value === 'dependencies' && node.value.properties) {
              for (let property of node.value.properties) {
                if (isEmberDependency(property.key.value)) {
                  self.dependencies.add({
                    packageName: property.key.value,
                    version: property.value.value,
                    type: 'dependency',
                    startLine: property.loc.start.line,
                    startColumn: property.loc.start.column,
                  });
                }
              }
            }
            if (node.key.value === 'devDependencies' && node.value.properties) {
              for (let property of node.value.properties) {
                if (isEmberDependency(property.key.value)) {
                  self.dependencies.add({
                    packageName: property.key.value,
                    version: property.value.value,
                    type: 'devDependency',
                    startLine: property.loc.start.line,
                    startColumn: property.loc.start.column,
                  });
                }
              }
            }
          },
        };
      }
    }

    let dependencyAccumulator = new DependenciesAccumulator();
    let analyzer = new JsonAnalyzer(this.context.pkgSource);

    analyzer.analyze(dependencyAccumulator.visitors);

    return dependencyAccumulator.dependencies;
  }
}

function isEmberDependency(dependency: string) {
  return dependency.startsWith('ember-') && !dependency.startsWith('ember-cli');
}
