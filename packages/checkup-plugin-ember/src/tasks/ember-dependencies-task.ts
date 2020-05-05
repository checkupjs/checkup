import {
  BaseTask,
  Category,
  Priority,
  Task,
  TaskItemData,
  TaskResult,
  getPackageJson,
} from '@checkup/core';

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

    let taskItemData: TaskItemData[] = [];

    taskItemData.push(
      {
        type: 'ember core libraries',
        data: coreLibraries,
        total: Object.keys(coreLibraries).length,
      },
      {
        type: 'ember dependencies',
        data: emberDependencies,
        total: Object.keys(emberDependencies).length,
      },
      {
        type: 'ember devDependencies',
        data: emberDevDependencies,
        total: Object.keys(emberDevDependencies).length,
      },
      {
        type: 'ember-cli dependencies',
        data: emberCliDependencies,
        total: Object.keys(emberCliDependencies).length,
      },
      {
        type: 'ember-cli devDependencies',
        data: emberCliDevDependencies,
        total: Object.keys(emberCliDevDependencies).length,
      }
    );

    result.dependencies = taskItemData;

    return result;
  }
}
