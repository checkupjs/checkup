import { Task, TaskMetaData, TaskResult, BaseTask } from '@checkup/core';
import EmberInRepoAddonEnginesTaskResult from '../results/ember-in-repo-addons-engines-task-result';
import { buildSummary } from '@checkup/core';

import { PackageJson } from 'type-fest';
import { readJsonSync } from 'fs-extra';

export default class EmberInRepoAddonsEnginesTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'ember-in-repo-addons-engines',
    friendlyTaskName: 'Ember In-Repo Addons / Engines',
    taskClassification: {
      category: 'metrics',
      group: 'ember',
    },
  };

  async run(): Promise<TaskResult> {
    let result: EmberInRepoAddonEnginesTaskResult = new EmberInRepoAddonEnginesTaskResult(
      this.meta,
      this.config
    );

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

    result.process([
      buildSummary('in-repo engines', inRepoEngines.sort()),
      buildSummary('in-repo addons', inRepoAddons.sort()),
    ]);

    return result;
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
