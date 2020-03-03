import {
  BaseTask,
  Category,
  Priority,
  TaskClassification,
  TaskResult,
  getPackageJson,
} from '@checkup/core';

import { DependenciesTaskResult } from '../results';
import { PackageJson } from 'type-fest';

/**
 * @param packageJson
 * @param key
 * @returns {string}
 */
function findDependency(packageJson: PackageJson, key: string): string {
  return (
    (packageJson.dependencies && packageJson.dependencies[key]) ||
    (packageJson.devDependencies && packageJson.devDependencies[key]) ||
    'Not found'
  );
}

/**
 * @param dependencies
 * @param filter
 * @returns Record<string, string>
 */
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

/**
 * @param dependency
 * @returns {boolean}
 */
function emberAddonFilter(dependency: string) {
  return dependency.startsWith('ember-') && !dependency.startsWith('ember-cli');
}

/**
 * @param dependency
 * @returns {boolean}
 */
function emberCliAddonFilter(dependency: string) {
  return dependency.startsWith('ember-cli');
}

export default class DependenciesTask extends BaseTask {
  taskName: string = 'dependencies';
  friendlyTaskName: string = 'Project Dependencies';
  taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.Medium,
  };

  async run(): Promise<TaskResult> {
    let result: DependenciesTaskResult = new DependenciesTaskResult(this);
    let packageJson = getPackageJson(this.args.path);

    result.emberLibraries['ember-source'] = findDependency(packageJson, 'ember-source');
    result.emberLibraries['ember-cli'] = findDependency(packageJson, 'ember-cli');
    result.emberLibraries['ember-data'] = findDependency(packageJson, 'ember-data');
    result.emberAddons = {
      dependencies: findDependencies(packageJson.dependencies, emberAddonFilter),
      devDependencies: findDependencies(packageJson.devDependencies, emberAddonFilter),
    };

    result.emberCliAddons = {
      dependencies: findDependencies(packageJson.dependencies, emberCliAddonFilter),
      devDependencies: findDependencies(packageJson.devDependencies, emberCliAddonFilter),
    };

    return result;
  }
}
