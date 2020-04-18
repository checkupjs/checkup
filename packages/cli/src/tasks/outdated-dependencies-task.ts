import { BaseTask, Category, Priority, Task, TaskMetaData, TaskResult } from '@checkup/core';
import OutdatedDependenciesTaskResult from '../results/outdated-dependencies-task-result';

const hash = require('promise.hash.helper');
const shell = require('shelljs');
const semver = require('semver');
const OUTDATED_DEP = 'yarn outdated --json';

export type OutdatedDependencies = {
  tableHead: [string];
  tableBody: Array<string[]>;
};

async function getOutdatedDep(): Promise<OutdatedDependencies> {
  const { stdout } = await shell.exec(OUTDATED_DEP, { silent: true });
  // stripping out color legend info from the output
  const outdatedDepTable = JSON.parse(stdout.split('}')[1] + '}}');

  return hash({
    tableHead: outdatedDepTable.data.head,
    tableBody: outdatedDepTable.data.body,
  });
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
    const outdatedDep = await getOutdatedDep();
    let versionTypes: Map<string, Array<string[]>> = new Map<string, Array<string[]>>([
      ['major', []],
      ['minor', []],
      ['patch', []],
    ]);

    for (let dependency of outdatedDep.tableBody) {
      try {
        // for catching when dependency version is 'exotic', which means yarn cannot retect for you whether the package has become outdated
        const versionType = semver.diff(dependency[1], dependency[3]);
        versionTypes.get(versionType)?.push(dependency);
      } catch (error) {
        // do nothing
      }
    }

    result.versionTypes = versionTypes;
    result.outdatedDependencies = outdatedDep;
    return result;
  }
}
