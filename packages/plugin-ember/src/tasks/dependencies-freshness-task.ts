import { BaseTask, Category, Priority, Task, TaskMetaData, TaskResult } from '@checkup/core';
import DependenciesFreshnessTaskResult from '../results/dependencies-freshness-task-result';
import { DepFreshnessInfo } from '../types';

const hash = require('promise.hash.helper');
const shell = require('shelljs');
const OUTDATED_DEP = 'yarn outdated --json';

async function getOutdatedDep(): Promise<DepFreshnessInfo> {
  const { stdout } = await shell.exec(OUTDATED_DEP, { silent: true });

  // stripping out color legend info from the output
  const outdatedDepTable = JSON.parse(stdout.split('}')[1] + '}}');
  // todo: error handle when there is no outdatedDep
  return hash({
    tableHead: outdatedDepTable.data.head,
    tableBody: outdatedDepTable.data.body,
  });
}

export default class DependenciesFreshnessTask extends BaseTask implements Task {
  meta: TaskMetaData = {
    taskName: 'dependencies-freshness',
    friendlyTaskName: 'Dependencies Freshness',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.High,
    },
  };

  async run(): Promise<TaskResult> {
    let result: DependenciesFreshnessTaskResult = new DependenciesFreshnessTaskResult(this.meta);
    result.depFreshnessInfo = await getOutdatedDep();

    return result;
  }
}
