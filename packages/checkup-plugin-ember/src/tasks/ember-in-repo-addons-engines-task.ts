import { Task, BaseTask, TaskError, TaskContext } from '@checkup/core';

import { PackageJson } from 'type-fest';
import { readJson } from 'fs-extra';

import { Result } from 'sarif';

export default class EmberInRepoAddonsEnginesTask extends BaseTask implements Task {
  taskName = 'ember-in-repo-addons-engines';
  taskDisplayName = 'Ember In-Repo Addons / Engines';
  description = 'Finds all in-repo engines and addons in an Ember.js project';
  category = 'metrics';
  group = 'ember';

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.addRule({
      properties: {
        component: {
          name: 'list',
          options: {
            items: {
              Engine: {
                groupBy: 'properties.type',
                value: 'engine',
              },
              Addon: {
                groupBy: 'properties.type',
                value: 'addon',
              },
            },
          },
        },
      },
    });
  }

  async run(): Promise<Result[]> {
    let packageJsonPaths: string[] = this.context.paths.filterByGlob('**/*package.json');

    for (let pathName of packageJsonPaths) {
      let packageJson: PackageJson = await this.getPackageJson(pathName);
      let isEngine = packageJson.keywords?.includes('ember-engine') && packageJson.name;
      let isAddon = packageJson.keywords?.includes('ember-addon') && packageJson.name;

      if (isEngine || isAddon) {
        let type = isEngine ? 'engine' : 'addon';

        this.addResult(`${packageJson.name} Ember ${type} found.`, 'review', 'note', {
          location: {
            uri: pathName,
          },
          properties: {
            type,
          },
        });
      }
    }

    return this.results;
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
