import { BaseTask, Category, Priority, Task, TaskMetaData, TaskResult } from '@checkup/core';
import OutdatedDependenciesTaskResult from '../results/outdated-dependencies-task-result';

const hash = require('promise.hash.helper');
const shell = require('shelljs');
const OUTDATED_DEP = 'yarn outdated --json';

export type OutdatedDependencies = {
  tableHead: [string];
  tableBody: Array<String[]>;
};

async function getOutdatedDep(): Promise<OutdatedDependencies> {
  const { stdout } = await shell.exec(OUTDATED_DEP, { silent: true });

  // stripping out color legend info from the output
  const outdatedDepTable = JSON.parse(stdout.split('}')[1] + '}}');
  // todo: error handle when there is no outdatedDep
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
    result.outdatedDependencies = await getOutdatedDep();

    return result;
  }
}
