import { BaseTask, TaskResult, getPackageJson } from '@checkup/core';

import { DependenciesTaskResult } from '../results';
import { PackageJson } from 'type-fest';

function findDependency(pkg: PackageJson, key: string): string {
  return (
    (pkg.dependencies && pkg.dependencies[key]) ||
    (pkg.devDependencies && pkg.devDependencies[key]) ||
    'Not found'
  );
}

function findDependencies(
  dependencies: PackageJson.Dependency | undefined,
  filter: (dependency: string) => boolean
) {
  if (typeof dependencies === 'undefined') {
    return {};
  }

  return Object.entries(dependencies).reduce((orig: Record<string, string>, pair) => {
    let [key, value] = pair;

    if (filter(key)) {
      orig[key] = value;
    }

    return orig;
  }, {});
}

function emberAddonFilter(dependency: string) {
  return dependency.startsWith('ember-') && !dependency.startsWith('ember-cli');
}

function emberCliAddonFilter(dependency: string) {
  return dependency.startsWith('ember-cli');
}

export default class DependenciesTask extends BaseTask {
  static taskName: string = 'dependencies';
  static friendlyTaskName: string = 'Project Dependencies';

  async run(): Promise<TaskResult> {
    let result: DependenciesTaskResult = new DependenciesTaskResult();
    let pkg: PackageJson = getPackageJson(this.args.path);

    result.emberLibraries['ember-source'] = findDependency(pkg, 'ember-source');
    result.emberLibraries['ember-cli'] = findDependency(pkg, 'ember-cli');
    result.emberLibraries['ember-data'] = findDependency(pkg, 'ember-data');
    result.emberAddons = {
      dependencies: findDependencies(pkg.dependencies, emberAddonFilter),
      devDependencies: findDependencies(pkg.devDependencies, emberAddonFilter),
    };

    result.emberCliAddons = {
      dependencies: findDependencies(pkg.dependencies, emberCliAddonFilter),
      devDependencies: findDependencies(pkg.devDependencies, emberCliAddonFilter),
    };

    return result;
  }
}
