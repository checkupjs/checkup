import { BaseTask, Task, TaskResult } from '@checkup/core';

import EmberDependenciesTaskResult from '../results/ember-dependencies-task-result';
import { PackageJson } from 'type-fest';

export default class EmberDependenciesTask extends BaseTask implements Task {
  meta = {
    taskName: 'ember-dependencies',
    friendlyTaskName: 'Ember Dependencies',
    taskClassification: {
      category: 'dependencies',
      group: 'ember',
    },
  };

  async run(): Promise<TaskResult> {
    let result: EmberDependenciesTaskResult = new EmberDependenciesTaskResult(
      this.meta,
      this.config
    );
    let packageJson = this.context.pkg;

    let coreLibraries: Record<string, string> = {
      'ember-source': findDependency(packageJson, 'ember-source'),
      'ember-cli': findDependency(packageJson, 'ember-cli'),
      'ember-data': findDependency(packageJson, 'ember-data'),
    };
    let emberDependencies = findDependencies(packageJson.dependencies, emberAddonFilter);
    let emberDevDependencies = findDependencies(packageJson.devDependencies, emberAddonFilter);
    let emberCliDependencies = findDependencies(packageJson.dependencies, emberCliAddonFilter);
    let emberCliDevDependencies = findDependencies(
      packageJson.devDependencies,
      emberCliAddonFilter
    );

    let dependencyResults: [string, Record<string, string>][] = [
      ['ember core libraries', coreLibraries],
      ['ember addon dependencies', emberDependencies],
      ['ember addon devDependencies', emberDevDependencies],
      ['ember-cli addon dependencies', emberCliDependencies],
      ['ember-cli addon devDependencies', emberCliDevDependencies],
    ];

    result.process({ dependencyResults });

    return result;
  }
}

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
