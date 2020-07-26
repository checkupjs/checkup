import * as npmCheck from 'npm-check';

import { BaseTask, Task, TaskMetaData, TaskResult, buildMultiValueResult } from '@checkup/core';

import OutdatedDependenciesTaskResult from '../results/outdated-dependencies-task-result';

export type Dependency = {
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

interface OutdatedDependency {
  packageName: string;
  packageJsonVersion: string;
  homepage: string;
  latest: string;
  installed: string;
  wanted: string;
  semverBump: string;
}

async function getDependencies(path: string): Promise<OutdatedDependency[]> {
  let result;
  let packages;

  try {
    result = await npmCheck({ cwd: path });
  } catch {
    throw new Error('Could not check project dependencies');
  }

  packages = result.get('packages').map((pkg: Dependency) => {
    return {
      packageName: pkg.moduleName,
      packageJsonVersion: pkg.packageJson,
      homepage: pkg.homepage,
      latest: pkg.latest,
      installed: pkg.installed,
      wanted: pkg.packageWanted,
      semverBump: pkg.bump,
    };
  });

  return packages;
}

export default class OutdatedDependenciesTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'outdated-dependencies',
    friendlyTaskName: 'Outdated Dependencies',
    taskClassification: {
      category: 'dependencies',
    },
  };

  async run(): Promise<TaskResult> {
    let result: OutdatedDependenciesTaskResult = new OutdatedDependenciesTaskResult(
      this.meta,
      this.config
    );

    let outdatedDependencies = await getDependencies(this.context.cliFlags.cwd);

    let multiValue = buildMultiValueResult('dependencies', outdatedDependencies, 'semverBump', [
      'major',
      'minor',
      'patch',
    ]);

    result.process([multiValue]);

    return result;
  }
}
