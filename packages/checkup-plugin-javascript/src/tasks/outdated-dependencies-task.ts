import * as npmCheck from 'npm-check';

import { BaseTask, Task, buildMultiValueResult, TaskResult } from '@checkup/core';

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
  taskName = 'outdated-dependencies';
  taskDisplayName = 'Outdated Dependencies';
  category = 'dependencies';

  async run(): Promise<TaskResult> {
    let outdatedDependencies = await getDependencies(this.context.cliFlags.cwd);

    let multiValue = buildMultiValueResult('dependencies', outdatedDependencies, 'semverBump', [
      'major',
      'minor',
      'patch',
    ]);

    return this.toJson([multiValue]);
  }
}
