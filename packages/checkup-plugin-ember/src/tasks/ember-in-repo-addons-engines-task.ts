import { Task, BaseTask } from '@checkup/core';
import { buildResultsFromPathArray } from '@checkup/core';

import { PackageJson } from 'type-fest';
import { readJsonSync } from 'fs-extra';

import { Result } from 'sarif';

export default class EmberInRepoAddonsEnginesTask extends BaseTask implements Task {
  taskName = 'ember-in-repo-addons-engines';
  taskDisplayName = 'Ember In-Repo Addons / Engines';
  category = 'metrics';
  group = 'ember';

  async run(): Promise<Result[]> {
    let inRepoAddons: string[] = [];
    let inRepoEngines: string[] = [];

    let packageJsonPaths: string[] = this.context.paths.filterByGlob('**/*package.json');

    packageJsonPaths.forEach((pathName: string) => {
      let packageJson: PackageJson = getPackageJson(pathName);

      if (packageJson.keywords?.includes('ember-engine') && packageJson.name) {
        inRepoEngines.push(packageJson.name);
      } else if (packageJson.keywords?.includes('ember-addon') && packageJson.name) {
        inRepoAddons.push(packageJson.name);
      }
    });

    return [
      ...buildResultsFromPathArray(this, inRepoAddons.sort(), 'in-repo addons'),
      ...buildResultsFromPathArray(this, inRepoEngines.sort(), 'in-repo engines'),
    ];
  }
}

function getPackageJson(packageJsonPath: string): PackageJson {
  let package_ = {};

  try {
    package_ = readJsonSync(packageJsonPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`No package.json file detected at ${packageJsonPath}`);
    }
  }

  return package_;
}
