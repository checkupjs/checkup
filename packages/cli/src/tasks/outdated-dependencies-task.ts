import * as npmCheck from 'npm-check';

import {
  BaseTask,
  Category,
  Priority,
  Task,
  TaskMetaData,
  TaskResult,
  getPackageJson,
} from '@checkup/core';

import OutdatedDependenciesTaskResult from '../results/outdated-dependencies-task-result';

export type OutdatedDependency = {
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

async function getOutdated(path: string): Promise<OutdatedDependency[]> {
  let result;
  let packages;

  try {
    result = await npmCheck({ cwd: path });
  } catch (error) {
    throw new Error('Could not check project dependencies');
  }

  packages = result.get('packages');

  return packages;
}

function getTotalDependencies(path: string) {
  let packageJson = getPackageJson(path);

  return (
    Object.keys(packageJson.dependencies ?? {}).length +
    Object.keys(packageJson.devDependencies ?? {}).length
  );
}

export default class OutdatedDependenciesTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'outdated-dependencies',
    friendlyTaskName: 'Outdated Dependencies',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.High,
    },
  };

  async run(): Promise<TaskResult> {
    let result: OutdatedDependenciesTaskResult = new OutdatedDependenciesTaskResult(this.meta);

    result.outdatedDependencies = await getOutdated(this.context.cliFlags.cwd);
    result.totalDependencies = getTotalDependencies(this.context.cliFlags.cwd);

    return result;
  }
}
