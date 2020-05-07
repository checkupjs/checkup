import * as npmCheck from 'npm-check';

import { BaseTask, Category, Priority, Task, TaskMetaData, TaskResult } from '@checkup/core';

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
    let dependencies = await getOutdated(this.context.cliArguments.path);
    let versionTypes: Map<string, Array<OutdatedDependency>> = new Map<
      string,
      Array<OutdatedDependency>
    >([
      ['major', []],
      ['minor', []],
      ['patch', []],
    ]);

    for (let dependency of dependencies) {
      try {
        // for catching when dependency version is 'exotic', which means yarn cannot detect for you whether the package has become outdated
        versionTypes.get(dependency.bump)?.push(dependency);
      } catch (error) {
        // do nothing
      }
    }

    result.dependencies = dependencies;
    result.versionTypes = versionTypes;
    return result;
  }
}
