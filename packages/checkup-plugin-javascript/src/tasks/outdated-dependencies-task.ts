import * as npmCheck from 'npm-check';

import { BaseTask, Task, groupDataByField, sarifBuilder } from '@checkup/core';
import { Result } from 'sarif';

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
      semverBump: pkg.bump === null ? 'current' : pkg.bump,
    };
  });

  return packages;
}

export default class OutdatedDependenciesTask extends BaseTask implements Task {
  taskName = 'outdated-dependencies';
  taskDisplayName = 'Outdated Dependencies';
  category = 'dependencies';

  async run(): Promise<Result[]> {
    let outdatedDependencies = await getDependencies(this.context.options.cwd);
    let groupedDependencies = groupDataByField(outdatedDependencies, 'semverBump');

    return groupedDependencies.flatMap((dependencyGroup) =>
      sarifBuilder.fromData(this, dependencyGroup, dependencyGroup[0].semverBump)
    );
  }
}
