import { StackFrame } from 'sarif';
import unparse from 'yargs-unparser';
import { DEFAULT_CONFIG, getConfigHash } from '../config.js';
import { getVersion } from '../utils/get-version.js';
import { getRepositoryInfo } from '../utils/repository.js';
import { FilePathArray } from '../utils/file-path-array.js';
import extractStack from '../utils/extract-stack.js';
import { AnnotationArgs, CheckupLogBuilderArgs } from '../types/checkup-log.js';
import { CheckupConfig } from '../types/config.js';
import { Task, TaskAction, TaskListError } from '../types/tasks.js';
import SarifLogBuilder from './sarif-log-builder.js';
import { trimAllCwd } from './path.js';

/**
 * A class that simplifies the building of a checkup SARIF log.
 *
 * @export
 * @class CheckupLogBuilder
 * @extends {SarifLogBuilder}
 */
export default class CheckupLogBuilder extends SarifLogBuilder {
  args: CheckupLogBuilderArgs;
  config: CheckupConfig = DEFAULT_CONFIG;
  actions: TaskAction[] = [];
  errors: TaskListError[] = [];
  timings: Record<string, number> = {};
  executedTasks: Task[] = [];

  startTime: string;

  constructor(args: CheckupLogBuilderArgs) {
    super();

    this.args = args;
    this.startTime = new Date().toJSON();

    this.addRun();
  }

  /**
   * Annotates the log with any data that is acquired via dynamic invocations.
   * This supplements the data acquired statically, and populated in the constructor.
   */
  async annotate(annotations: AnnotationArgs) {
    ({
      config: this.config,
      actions: this.actions,
      errors: this.errors,
      timings: this.timings,
      executedTasks: this.executedTasks,
    } = annotations);

    this.addInvocation({
      executionSuccessful: true,
      arguments: unparse(this.args.options),
      startTimeUtc: this.startTime,
      endTimeUtc: new Date().toJSON(),
    });

    await this.addCheckupMetadata();

    this.addTaskExecutionNotifications();
    this.addExecptionNotifications();
    this.addActionNotifications();
  }

  async addCheckupMetadata() {
    let paths = this.args.paths ?? new FilePathArray();
    let cwd = this.args.options.cwd;
    let config = this.config;
    let repositoryInfo = await getRepositoryInfo(cwd);
    let analyzedFiles = trimAllCwd(paths, cwd);

    this.currentRunBuilder.run.tool.driver.properties = {
      checkup: {
        project: {
          name: this.args.analyzedPackageJson.name || '',
          version: this.args.analyzedPackageJson.version || '',
          repository: repositoryInfo,
        },

        cli: {
          configHash: getConfigHash(config),
          config,
          version: getVersion(),
          schema: 1,
        },

        analyzedFiles,
        analyzedFilesCount: analyzedFiles.length,
        timings: this.timings,
      },
    };
  }

  addTaskExecutionNotifications() {
    this.executedTasks.forEach((task) => {
      this.addNotification({
        id: task.fullyQualifiedTaskName,
        name: 'Execution completed',
      });
    });
  }

  addExecptionNotifications(): void {
    this.errors.forEach((error) => {
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
          message: error.error?.message,
          stack: {
            frames: stackFrames,
          },
        },
      });
    });
  }

  addActionNotifications(): void {
    this.actions.forEach((action) => {
      this.addToolExecutionNotification({
        message: { text: `${action.summary} (${action.details})` },
        level: 'warning',
        associatedRule: {
          id: action.taskName,
        },
        properties: {
          name: action.name,
          summary: action.summary,
          details: action.details,
        },
      });
    });
  }
}
