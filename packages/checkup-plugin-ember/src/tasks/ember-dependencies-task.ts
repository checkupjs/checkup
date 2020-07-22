import { BaseTask, Task, TaskResult, SummaryData } from '@checkup/core';
import { formatSummary } from '@checkup/core';

import EmberDependenciesTaskResult from '../results/ember-dependencies-task-result';
import { PackageJson } from 'type-fest';

type Dependency = {
  packageName: string;
  version: string;
};

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

    let coreLibraries: SummaryData = formatSummary('ember core libraries', [
      findDependency(packageJson, 'ember-source'),
      findDependency(packageJson, 'ember-cli'),
      findDependency(packageJson, 'ember-data'),
    ]);
    let emberDependencies = formatSummary(
      'ember addon dependencies',
      findDependencies(packageJson.dependencies, emberAddonFilter)
    );
    let emberDevDependencies = formatSummary(
      'ember addon devDependencies',
      findDependencies(packageJson.devDependencies, emberAddonFilter)
    );
    let emberCliDependencies = formatSummary(
      'ember-cli addon dependencies',
      findDependencies(packageJson.dependencies, emberCliAddonFilter)
    );
    let emberCliDevDependencies = formatSummary(
      'ember-cli addon devDependencies',
      findDependencies(packageJson.devDependencies, emberCliAddonFilter)
    );

    result.process([
      coreLibraries,
      emberDependencies,
      emberDevDependencies,
      emberCliDependencies,
      emberCliDevDependencies,
    ]);

    return result;
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
