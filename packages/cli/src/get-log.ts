import {
  Action,
  CheckupConfig,
  trimAllCwd,
  Task,
  TaskContext2,
  CheckupMetadata2,
  TaskError,
  RunOptions,
  sarifBuilder,
} from '@checkup/core';
import * as crypto from 'crypto';
import * as stringify from 'json-stable-stringify';
import * as unparse from 'yargs-unparser';
import { Invocation, Log, ReportingDescriptor, Result } from 'sarif';
import { getVersion } from './utils/get-version';
import { getRepositoryInfo } from './utils/repository';
import TaskList from './task-list';

function getInvocation(options: RunOptions, errors: TaskError[], startTime: string): Invocation {
  return {
    arguments: unparse(options),
    executionSuccessful: true,
    endTimeUtc: new Date().toJSON(),
    environmentVariables: {
      cwd: options.cwd,
      outputFile: options.outputFile,
      format: options.format,
    },
    toolExecutionNotifications: sarifBuilder.notifications.fromTaskErrors(errors),
    startTimeUtc: startTime,
  };
}

export async function getLog(
  options: RunOptions,
  taskContext: TaskContext2,
  taskResults: Result[],
  actions: Action[],
  errors: TaskError[],
  taskList: TaskList,
  executedTasks: Task[],
  startTime: string
): Promise<Log> {
  let checkupMetadata = await getCheckupMetadata(taskContext);

  return {
    version: '2.1.0',
    $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json',
    properties: { ...checkupMetadata, actions, timings: taskList.timings },
    runs: [
      {
        results: taskResults,
        invocations: [getInvocation(options, errors, startTime)],
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

async function getCheckupMetadata(taskContext: TaskContext2): Promise<CheckupMetadata2> {
  let package_ = taskContext.pkg;
  let repositoryInfo = await getRepositoryInfo(taskContext.options.cwd, taskContext.paths);

  let { config, tasks, format } = taskContext.options;
  let analyzedFiles = trimAllCwd(taskContext.paths, taskContext.options.cwd);

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
      args: unparse(taskContext.options),
      flags: {
        config,
        tasks,
        format,
        outputFile: taskContext.options.outputFile,
        excludePaths: taskContext.options.excludePaths,
      },
    },

    analyzedFiles,
    analyzedFilesCount: analyzedFiles.length,
  };
}
