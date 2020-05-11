import {
  Category,
  Priority,
  Task,
  TaskMetaData,
  TaskResult,
  FileSearcherTask,
  TaskContext,
} from '@checkup/core';
import EmberInRepoAddonEnginesTaskResult from '../results/ember-in-repo-addons-engines-task-result';
import { getPackageJson } from '@checkup/core';
import { PackageJson } from 'type-fest';

export default class EmberInRepoAddonsEnginesTask extends FileSearcherTask implements Task {
  meta: TaskMetaData = {
    taskName: 'ember-in-repo-addons-engines',
    friendlyTaskName: 'Ember In-Repo Addons / Engines',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.Low,
    },
  };

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context, { packageJson: ['**/*package.json'] });
  }

  async run(): Promise<TaskResult> {
    let result: EmberInRepoAddonEnginesTaskResult = new EmberInRepoAddonEnginesTaskResult(
      this.meta
    );
    let searchResults = await this.searcher.search();

    result.inRepoAddons = [];
    result.inRepoEngines = [];

    let packageJsonPaths: string[] = searchResults[0].data as string[];

    packageJsonPaths.forEach((pathName: string) => {
      let packageJson: PackageJson = getPackageJson(this.context.cliArguments.path, pathName);

      if (packageJson.keywords?.includes('ember-engine') && packageJson.name) {
        result.inRepoEngines.push(packageJson.name);
      } else if (packageJson.keywords?.includes('ember-addon') && packageJson.name) {
        result.inRepoAddons.push(packageJson.name);
      }
    });
    return result;
  }
}
