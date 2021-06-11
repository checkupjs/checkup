import { StackFrame } from 'sarif';
import * as unparse from 'yargs-unparser';
import { getConfigHash } from '../config';
import { getVersion } from '../utils/get-version';
import { getRepositoryInfo } from '../utils/repository';
import { FilePathArray } from '../utils/file-path-array';
import extractStack from '../utils/extract-stack';
import { CheckupLogBuilderArgs } from '../types/checkup-log';
import SarifLogBuilder from './sarif-log-builder';
import { trimAllCwd } from './path';

export default class CheckupLogBuilder extends SarifLogBuilder {
  args: CheckupLogBuilderArgs;
  startTime: string;

  constructor(args: CheckupLogBuilderArgs) {
    super();

    this.args = args;
    this.startTime = new Date().toJSON();

    this.addRun();
  }

  async annotate() {
    this.addInvocation({
      executionSuccessful: true,
      arguments: unparse(this.args.options),
      startTimeUtc: this.startTime,
      endTimeUtc: new Date().toJSON(),
    });

    await this.addCheckupMetadata();

    this.addExecptionNotifications();
    this.addActionNotifications();
  }

  async addCheckupMetadata() {
    let paths = this.args.paths ?? new FilePathArray();
    let cwd = this.args.options.cwd;
    let config = this.args.config;
    let repositoryInfo = await getRepositoryInfo(cwd, paths);
    let analyzedFiles = trimAllCwd(paths, cwd);

    this.currentRunBuilder.run.tool.driver.properties = {
      project: {
        name: this.args.packageName || '',
        version: this.args.packageVersion || '',
        repository: repositoryInfo,
      },

      cli: {
        configHash: getConfigHash(config),
        config: config,
        version: getVersion(cwd),
        schema: 1,
      },

      analyzedFiles,
      analyzedFilesCount: analyzedFiles.length,
      timings: this.args.taskTimings,
    };
  }

  addExecptionNotifications(): void {
    this.args.errors.forEach((error) => {
      let stackFrames: StackFrame[] = extractStack.lines(error.error).map((line) => {
        return { module: line };
      });

      this.addToolExecutionNotification({
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
      });
    });
  }

  addActionNotifications(): void {
    this.args.actions.forEach((action) => {
      this.addToolExecutionNotification({
        message: { text: action.details },
        level: 'warning',
        associatedRule: {
          id: action.taskName,
        },
      });
    });
  }
}
