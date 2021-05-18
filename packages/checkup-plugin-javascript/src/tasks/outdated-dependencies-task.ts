import { join } from 'path';
import * as npmCheck from 'npm-check';

import { BaseTask, Task, TaskError, JsonAnalyzer } from '@checkup/core';
import { Result } from 'sarif';

export type NpmDependency = {
  moduleName: string;
  homepage: string;
  regError: string | undefined;
  pkgError: string | undefined;
  latest: string;
  installed: string;
  isInstalled: boolean;
  notInstalled: boolean;
  packageWanted: string;
  packageJson: string;
  devDependency: boolean;
  usedInScripts: string[] | undefined;
  mismatch: boolean;
  semverValid: string;
  easyUpgrade: boolean;
  bump: string;
  unused: boolean;
};

interface Dependency {
  packageName: string;
  version: string;
  type: 'dependency' | 'devDependency';
  startLine: number;
  startColumn: number;
}

export default class OutdatedDependenciesTask extends BaseTask implements Task {
  taskName = 'outdated-dependencies';
  taskDisplayName = 'Outdated Dependencies';
  description = 'Gets a summary of all outdated dependencies in a project';
  category = 'dependencies';

  async run(): Promise<Result[]> {
    let dependencies = [...this.getDependencies()];
    let outdatedDependencies = await this.getOutdatedDependencies(this.context.options.cwd);

    return outdatedDependencies.map((dependency: NpmDependency) => {
      let dependencySourceInfo = dependencies.find(
        (depencencyInfo) => depencencyInfo.packageName === dependency.moduleName
      ) || {
        startLine: 0,
        startColumn: 0,
      };

      return {
        ruleId: this.taskName,
        message: {
          text: `Outdated ${dependency.bump} version of ${dependency.moduleName}. Installed: ${dependency.installed}. Latest: ${dependency.latest}.`,
        },
        kind: 'review',
        level: getLevel(dependency.bump),
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: join(this.context.options.cwd, 'package.json'),
              },
              region: {
                startLine: dependencySourceInfo.startLine,
                startColumn: dependencySourceInfo.startColumn,
              },
            },
          },
        ],
        properties: {
          packageName: dependency.moduleName,
          packageVersion: dependency.packageJson,
          installed: dependency.installed,
          latest: dependency.latest,
          wanted: dependency.packageWanted,
          type: dependency.devDependency ? 'devDependency' : 'dependency',
        },
      };
    });
  }

  async getOutdatedDependencies(path: string): Promise<NpmDependency[]> {
    let result;

    try {
      result = await npmCheck({ cwd: path });
    } catch (error) {
      throw new TaskError({
        taskName: this.taskName,
        taskErrorMessage: `Could not check project dependencies. ${error.message}`,
      });
    }

    return result.get('packages');
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
                self.dependencies.add({
                  packageName: property.key.value,
                  version: property.value.value,
                  type: 'dependency',
                  startLine: property.loc.start.line,
                  startColumn: property.loc.start.column,
                });
              }
            }
            if (node.key.value === 'devDependencies' && node.value.properties) {
              for (let property of node.value.properties) {
                self.dependencies.add({
                  packageName: property.key.value,
                  version: property.value.value,
                  type: 'devDependency',
                  startLine: property.loc.start.line,
                  startColumn: property.loc.start.column,
                });
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

function getLevel(semverBump: string): Result.level {
  switch (semverBump) {
    case 'major': {
      return 'error';
    }
    case 'minor': {
      return 'warning';
    }
    case 'patch': {
      return 'note';
    }
    default: {
      return 'none';
    }
  }
}
