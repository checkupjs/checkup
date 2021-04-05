import { Task, BaseTask, sarifBuilder, TaskError } from '@checkup/core';

import { PackageJson } from 'type-fest';
import { readJson } from 'fs-extra';

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

    for (let pathName of packageJsonPaths) {
      let packageJson: PackageJson = await this.getPackageJson(pathName);

      if (packageJson.keywords?.includes('ember-engine') && packageJson.name) {
        inRepoEngines.push(packageJson.name);
      } else if (packageJson.keywords?.includes('ember-addon') && packageJson.name) {
        inRepoAddons.push(packageJson.name);
      }
    }

    return [
      ...sarifBuilder.fromLocations(this, inRepoAddons.sort(), 'in-repo addons'),
      ...sarifBuilder.fromLocations(this, inRepoEngines.sort(), 'in-repo engines'),
    ];
  }

  async getPackageJson(packageJsonPath: string): Promise<PackageJson> {
    let package_ = {};

    try {
      package_ = await readJson(packageJsonPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new TaskError({
          taskName: this.taskName,
          taskErrorMessage: `No package.json file detected at ${packageJsonPath}`,
        });
      }
    }

    return package_;
  }
}
