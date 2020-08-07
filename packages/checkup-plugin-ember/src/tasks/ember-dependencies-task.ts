import { BaseTask, Task, SummaryResult, TaskResult } from '@checkup/core';
import { buildSummaryResult } from '@checkup/core';

import { PackageJson } from 'type-fest';

type Dependency = {
  packageName: string;
  version: string;
};

export default class EmberDependenciesTask extends BaseTask implements Task {
  taskName = 'ember-dependencies';
  taskDisplayName = 'Ember Dependencies';
  category = 'dependencies';
  group = 'ember';

  async run(): Promise<TaskResult> {
    let packageJson = this.context.pkg;

    let coreLibraries: SummaryResult = buildSummaryResult('ember core libraries', [
      findDependency(packageJson, 'ember-source'),
      findDependency(packageJson, 'ember-cli'),
      findDependency(packageJson, 'ember-data'),
    ]);
    let emberDependencies = buildSummaryResult(
      'ember addon dependencies',
      findDependencies(packageJson.dependencies, emberAddonFilter)
    );
    let emberDevDependencies = buildSummaryResult(
      'ember addon devDependencies',
      findDependencies(packageJson.devDependencies, emberAddonFilter)
    );
    let emberCliDependencies = buildSummaryResult(
      'ember-cli addon dependencies',
      findDependencies(packageJson.dependencies, emberCliAddonFilter)
    );
    let emberCliDevDependencies = buildSummaryResult(
      'ember-cli addon devDependencies',
      findDependencies(packageJson.devDependencies, emberCliAddonFilter)
    );

    return this.toJson([
      coreLibraries,
      emberDependencies,
      emberDevDependencies,
      emberCliDependencies,
      emberCliDevDependencies,
    ]);
  }
}

function findDependency(packageJson: PackageJson, key: string): Dependency {
  let versionRange =
    (packageJson.dependencies && packageJson.dependencies[key]) ||
    (packageJson.devDependencies && packageJson.devDependencies[key]) ||
    'Not found';

  return {
    packageName: key,
    version: versionRange,
  };
}

function findDependencies(
  dependencies: PackageJson.Dependency | undefined,
  filter: (dependency: string) => boolean
) {
  if (typeof dependencies === 'undefined') {
    return [];
  }

  return Object.entries(dependencies)
    .map((pair) => {
      let [key, value] = pair;

      if (filter(key)) {
        return {
          packageName: key,
          version: value,
        };
      }

      return false;
    })
    .filter(Boolean) as Dependency[];
}

function emberAddonFilter(dependency: string) {
  return dependency.startsWith('ember-') && !dependency.startsWith('ember-cli');
}

function emberCliAddonFilter(dependency: string) {
  return dependency.startsWith('ember-cli');
}
