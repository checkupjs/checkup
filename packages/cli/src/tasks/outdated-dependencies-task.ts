import OutdatedDependenciesTaskResult from '../results/outdated-dependencies-task-result';
import { BaseTask } from '@checkup/core';
import { MetaTask, MetaTaskResult, TaskIdentifier } from '../types';

// const hash = require('promise.hash.helper');
const shell = require('shelljs');
const semver = require('semver');
const OUTDATED_DEP = 'yarn outdated --json';

export type OutdatedDependency = {
  package: String;
  current: String;
  wanted: String;
  latest: String;
  packageType: String;
  url: String;
};

async function getOutdatedDep(): Promise<OutdatedDependency[]> {
  const { stdout } = await shell.exec(OUTDATED_DEP, { silent: true });
  let outdatedDepTable;
  try {
    // stripping out color legend info from the output
    outdatedDepTable = JSON.parse(stdout.split('}')[1] + '}}');
  } catch (error) {
    console.log('invalid JSON object');
  }

  return _transformToTableData(outdatedDepTable.data.body);
}

function _transformToTableData(data: Array<String[]>) {
  let result: OutdatedDependency[] = [];

  data.forEach((dependency) => {
    const row = {
      package: dependency[0],
      current: dependency[1],
      wanted: dependency[2],
      latest: dependency[3],
      packageType: dependency[4],
      url: dependency[5],
    };
    result.push(row);
  });
  return result!;
}

export default class OutdatedDependenciesTask extends BaseTask implements MetaTask {
  meta: TaskIdentifier = {
    taskName: 'outdated-dependencies',
    friendlyTaskName: 'Outdated Dependencies',
  };

  async run(): Promise<MetaTaskResult> {
    let result: OutdatedDependenciesTaskResult = new OutdatedDependenciesTaskResult(this.meta);
    const outdatedDep = await getOutdatedDep();
    let versionTypes: Map<string, Array<OutdatedDependency>> = new Map<
      string,
      Array<OutdatedDependency>
    >([
      ['major', []],
      ['minor', []],
      ['patch', []],
    ]);

    for (let dependency of outdatedDep) {
      try {
        // for catching when dependency version is 'exotic', which means yarn cannot retect for you whether the package has become outdated
        const versionType = semver.diff(dependency.current, dependency.latest);
        versionTypes.get(versionType)?.push(dependency);
      } catch (error) {
        // do nothing
      }
    }

    result.versionTypes = versionTypes;
    return result;
  }
}
