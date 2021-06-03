import { Task, BaseTask, TaskError } from '@checkup/core';

import { PackageJson } from 'type-fest';
import { readJson } from 'fs-extra';

import { Result } from 'sarif';

export default class EmberInRepoAddonsEnginesTask extends BaseTask implements Task {
  taskName = 'ember-in-repo-addons-engines';
  taskDisplayName = 'Ember In-Repo Addons / Engines';
  description = 'Finds all in-repo engines and addons in an Ember.js project';
  category = 'metrics';
  group = 'ember';

  async run(): Promise<Result[]> {
    let results: Result[] = [];

    let packageJsonPaths: string[] = this.context.paths.filterByGlob('**/*package.json');

    for (let pathName of packageJsonPaths) {
      let packageJson: PackageJson = await this.getPackageJson(pathName);
      let isEngine = packageJson.keywords?.includes('ember-engine') && packageJson.name;
      let isAddon = packageJson.keywords?.includes('ember-addon') && packageJson.name;

      if (isEngine || isAddon) {
        results.push(
          this.addResult(
            `${packageJson.name} Ember ${isEngine ? 'engine' : 'addon'} found.`,
            'review',
            'note'
          )
        );
      }
    }

    return results;
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
