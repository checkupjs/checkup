import {
  Action,
  CheckupConfig,
  CheckupMetadata,
  trimAllCwd,
  Task,
  TaskContext,
} from '@checkup/core';
import * as crypto from 'crypto';
import * as stringify from 'json-stable-stringify';
import { Invocation, Log, ReportingDescriptor, Result } from 'sarif';
import { getVersion } from './utils/get-version';
import { getRepositoryInfo } from './utils/repository';
import TaskList from './task-list';

export async function getLog(
  taskContext: TaskContext,
  taskResults: Result[],
  actions: Action[],
  invocation: Invocation,
  taskList: TaskList,
  executedTasks: Task[]
): Promise<Log> {
  let checkupMetadata = await getCheckupMetadata(taskContext);

  return {
    version: '2.1.0',
    $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json',
    properties: { ...checkupMetadata, actions, timings: taskList.timings },
    runs: [
      {
        results: taskResults,
        invocations: [invocation],
        tool: {
          driver: {
            name: 'Checkup',
            rules: getReportingDescriptors(executedTasks),
            language: 'en-US',
            informationUri: 'https://github.com/checkupjs/checkup',
            version: checkupMetadata.cli.version,
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
function getReportingDescriptors(tasks: Task[]): ReportingDescriptor[] {
  return tasks.map((task: Task) => {
    return {
      id: task.taskName,
      shortDescription: { text: task.taskDisplayName },
      properties: { enabled: task.enabled, group: task.group, category: task.category },
    };
  });
}

function getConfigHash(checkupConfig: CheckupConfig) {
  let configAsJson = stringify(checkupConfig);

  return crypto.createHash('md5').update(configAsJson).digest('hex');
}

async function getCheckupMetadata(taskContext: TaskContext): Promise<CheckupMetadata> {
  let package_ = taskContext.pkg;
  let repositoryInfo = await getRepositoryInfo(taskContext.cliFlags.cwd, taskContext.paths);

  let { config, task, format } = taskContext.cliFlags;
  let analyzedFiles = trimAllCwd(taskContext.paths, taskContext.cliFlags.cwd);

  return {
    project: {
      name: package_.name || '',
      version: package_.version || '',
      repository: repositoryInfo,
    },

    cli: {
      configHash: getConfigHash(taskContext.config),
      config: taskContext.config,
      version: getVersion(),
      schema: 1,
      args: {
        paths: taskContext.cliArguments,
      },
      flags: {
        config,
        task,
        format,
        outputFile: taskContext.cliFlags['output-file'],
        excludePaths: taskContext.cliFlags['exclude-paths'],
      },
    },

    analyzedFiles,
    analyzedFilesCount: analyzedFiles.length,
  };
}
