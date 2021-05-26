import { Notification, StackFrame } from 'sarif';
import * as unparse from 'yargs-unparser';
import { getConfigHash } from '../config';
import { RunOptions } from '../types/cli';
import { TaskContext, TaskListError, Action } from '../types/tasks';
import { getVersion } from '../utils/get-version';
import { getRepositoryInfo } from '../utils/repository';
import { FilePathArray } from '../utils/file-path-array';
import { CheckupConfig } from '../types/config';
import extractStack from '../utils/extract-stack';
import SarifLogBuilder from './sarif-log-builder';
import { trimAllCwd } from './path';

interface LogBuilderArgs {
  packageName: string;
  packageVersion: string;
  config: CheckupConfig;
  options: RunOptions;
  actions: Action[];
  errors: TaskListError[];
  paths?: FilePathArray;
}

export default class CheckupLogBuilder extends SarifLogBuilder {
  args: LogBuilderArgs;
  startTime: string;

  constructor(args: LogBuilderArgs) {
    super();

    this.args = args;
    this.startTime = new Date().toJSON();

    this.addRun();
  }

  async annotate(taskContext: TaskContext) {
    let cwd = this.args.options.cwd;
    let repositoryInfo = await getRepositoryInfo(cwd, taskContext.paths);
    let analyzedFiles = trimAllCwd(taskContext.paths, cwd);

    this.addInvocation({
      executionSuccessful: true,
      arguments: unparse(this.args.options),
      startTimeUtc: this.startTime,
      endTimeUtc: new Date().toJSON(),
      toolExecutionNotifications: [
        ...this.buildExecptionNotifications(),
        ...this.buildActionNotifications(),
      ],
    });

    this.currentRun.tool.driver.properties = {
      project: {
        name: taskContext.pkg.name || '',
        version: taskContext.pkg.version || '',
        repository: repositoryInfo,
      },

      cli: {
        configHash: getConfigHash(taskContext.config),
        config: taskContext.config,
        version: getVersion(cwd),
        schema: 1,
      },

      analyzedFiles,
      analyzedFilesCount: analyzedFiles.length,
    };
  }

  private buildExecptionNotifications(): Notification[] {
    return this.args.errors.map((error) => {
      let stackFrames: StackFrame[] = extractStack.lines(error.error).map((line) => {
        return { module: line };
      });

      return {
        message: { text: `${error.taskName} generated an error during execution` },
        level: 'error',
        associatedRule: {
          id: error.taskName,
        },
        exception: {
          message: error.error.message,
          stack: {
            frames: stackFrames,
          },
        },
      };
    });
  }

  private buildActionNotifications(): Notification[] {
    return this.args.actions.map((action) => {
      return {
        message: { text: action.details },
        level: 'warning',
        associatedRule: {
          id: action.taskName,
        },
      };
    });
  }
}
