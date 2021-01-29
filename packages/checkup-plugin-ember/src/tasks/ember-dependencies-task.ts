import { BaseTask, Task, sarifBuilder } from '@checkup/core';

import { PackageJson } from 'type-fest';
import { Result } from 'sarif';

type Dependency = {
  packageName: string;
  version: string;
};

export default class EmberDependenciesTask extends BaseTask implements Task {
  taskName = 'ember-dependencies';
  taskDisplayName = 'Ember Dependencies';
  category = 'dependencies';
  group = 'ember';

  async run(): Promise<Result[]> {
    let packageJson = this.context.pkg;

    let coreLibraries = sarifBuilder.fromProperties(
      this,
      [
        findDependency(packageJson, 'ember-source'),
        findDependency(packageJson, 'ember-cli'),
        findDependency(packageJson, 'ember-data'),
      ],
      'ember core libraries'
    );
    let emberDependencies = sarifBuilder.fromProperties(
      this,
      findDependencies(packageJson.dependencies, emberAddonFilter),
      'ember addon dependencies'
    );
    let emberDevDependencies = sarifBuilder.fromProperties(
      this,
      findDependencies(packageJson.devDependencies, emberAddonFilter),
      'ember addon devDependencies'
    );
    let emberCliDependencies = sarifBuilder.fromProperties(
      this,
      findDependencies(packageJson.dependencies, emberCliAddonFilter),
      'ember-cli addon dependencies'
    );
    let emberCliDevDependencies = sarifBuilder.fromProperties(
      this,
      findDependencies(packageJson.devDependencies, emberCliAddonFilter),
      'ember-cli addon devDependencies'
    );

    return [
      ...coreLibraries,
      ...emberDependencies,
      ...emberDevDependencies,
      ...emberCliDependencies,
      ...emberCliDevDependencies,
    ];
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
