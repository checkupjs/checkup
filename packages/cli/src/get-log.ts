import { Action, CheckupMetadata, Task } from '@checkup/core';
import { Invocation, Log, Result, ReportingDescriptor } from 'sarif';
import TaskList from './task-list';
import { MetaTaskResult } from './types';

export function getLog(
  info: MetaTaskResult[],
  taskResults: Result[],
  actions: Action[],
  invocation: Invocation,
  taskList: TaskList
): Log {
  let _info = Object.assign(
    {},
    ...info.map((result) => result.appendCheckupProperties())
  ) as CheckupMetadata;

  return {
    version: '2.1.0',
    $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json',
    properties: { ..._info, actions, timings: taskList.timings },
    runs: [
      {
        results: taskResults,
        invocations: [invocation],
        tool: {
          driver: {
            name: 'Checkup',
            rules: getReportingDescriptors(taskList),
            language: 'en-US',
            informationUri: 'https://github.com/checkupjs/checkup',
            version: _info.cli.version,
          },
        },
      },
    ],
  };
}

/**
 *
 * @param taskNames
 * @returns {ReportingDescriptor[]} used to populate tool.driver.rules
 */
function getReportingDescriptors(taskList: TaskList): ReportingDescriptor[] {
  let tasks = taskList.getTasks();
  return tasks.map((task: Task) => {
    return {
      id: task.taskName,
      shortDescription: { text: task.taskDisplayName },
      properties: { enabled: task.enabled, group: task.group, category: task.category },
    };
  });
}
