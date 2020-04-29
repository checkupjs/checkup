import { BaseTask, Category, Priority, Task, TaskResult, getPackageJson } from '@checkup/core';

import EmberDependenciesTaskResult from '../results/ember-dependencies-task-result';
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

export default class EmberDependenciesTask extends BaseTask implements Task {
  meta = {
    taskName: 'dependencies',
    friendlyTaskName: 'Ember Dependencies',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.High,
    },
  };

  async run(): Promise<TaskResult> {
    let result: EmberDependenciesTaskResult = new EmberDependenciesTaskResult(this.meta);
    let packageJson = getPackageJson(this.context.cliArguments.path);

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
