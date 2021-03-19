import {
  Action,
  CheckupError,
  CheckupConfig,
  FilePathArray,
  getRegisteredActions,
  getConfigPathFromOptions,
  getConfigPath,
  getRegisteredParsers,
  getFilePathsAsync,
  readConfig,
  RunOptions,
  Task,
  TaskError,
  TaskContext2,
  ui,
  registerParser,
  registerActions,
  registerTaskReporter,
} from '@checkup/core';
import * as debug from 'debug';
import * as resolve from 'resolve';
import { join, dirname } from 'path';
import { Log, Result } from 'sarif';
import { getLog } from '../get-log2';
import { TASK_ERRORS } from '../task-errors';
import TaskList from '../task-list';
import { extendedError } from '../extended-error';
import { getPackageJson } from '../utils/get-package-json';
import { existsSync } from 'fs-extra';

// TODO: The way this is done currently will change, since it was largely
// built this way to accommodate oclif's dynamic loading. We will instead
// register these types directly on the class without the module-scoped
// registration, largely to accommodate mutliple instances of this class
// being invoked simultaneously.
const REGISTRATION_TYPES = new Map<string, object>([
  ['register-parsers', { registerParser }],
  ['register-actions', { registerActions }],
  ['register-task-reporters', { registerTaskReporter }],
]);

let __tasksForTesting: Set<Task> = new Set<Task>();

export function _registerTaskForTesting(task: Task) {
  __tasksForTesting.add(task);
}
export function _resetTasksForTesting() {
  __tasksForTesting = new Set<Task>();
}
export default class CheckupTaskRunner {
  actions: Action[] = [];
  config!: CheckupConfig;
  debug: debug.Debugger;
  executedTasks!: Task[];
  options: RunOptions;
  plugins: [] = [];
  startTime: string = new Date().toJSON();
  tasks: TaskList = new TaskList();
  taskResults: Result[] = [];
  taskErrors: TaskError[] = [];
  taskContext!: TaskContext2;

  get taskFilterType() {
    if (this.options.tasks !== undefined) {
      return 'task';
    } else if (this.options.categories !== undefined) {
      return 'category';
    } else if (this.options.groups !== undefined) {
      return 'group';
    }

    return '';
  }

  constructor(options: RunOptions) {
    this.debug = debug('checkup');
    this.options = options;

    this.debug('options %O', this.options);
  }

  async run(): Promise<Log> {
    await this.loadConfig();
    await this.forEachPlugin(REGISTRATION_TYPES);
    await this.registerTasks();

    await this.runTasks();
    await this.runActions();

    // TODO: This mechanism for getting a sarif log will change, and will
    // instead be encapsulated in the SarifBuilder.
    let log: Log = await getLog(
      this.options,
      this.taskContext,
      this.taskResults,
      this.actions,
      this.taskErrors,
      this.tasks,
      this.executedTasks,
      this.startTime
    );

    return log;
  }

  async getAvailableTasks() {
    await this.loadConfig();
    await this.registerTasks();

    return this.tasks.fullyQualifiedTaskNames;
  }

  private async runTasks() {
    if (this.taskFilterType) {
      let { tasksFound, tasksNotFound } = this.findTasks();

      if (tasksFound.length > 0) {
        [this.taskResults, this.taskErrors] = await this.tasks.runTasks(tasksFound);
      }

      if (tasksNotFound.length > 0) {
        let error = TASK_ERRORS.get(this.taskFilterType)!;

        extendedError(new CheckupError(error.message(tasksNotFound), error.callToAction));
        ui.action.stop();
      }

      this.executedTasks = tasksFound;
    } else {
      [this.taskResults, this.taskErrors] = await this.tasks.runTasks();
      this.executedTasks = this.tasks.getTasks();
    }
  }

  private findTasks() {
    if (this.options.tasks !== undefined) {
      return this.tasks.findAllByTaskName(...this.options.tasks);
    } else if (this.options.categories !== undefined) {
      return this.tasks.findAllByCategory(...this.options.categories);
    } else if (this.options.groups !== undefined) {
      return this.tasks.findAllByGroup(...this.options.groups);
    }

    return { tasksFound: [], tasksNotFound: [] };
  }

  private runActions() {
    return new Promise<void>((resolve, reject) => {
      let evaluators = getRegisteredActions();

      for (let [taskName, evaluator] of evaluators) {
        let task = this.tasks.find(taskName);

        let taskResult = this.taskResults.filter((result: Result) => {
          return result.properties?.taskName === taskName;
        });

        if (task && taskResult.length > 0) {
          try {
            this.actions.push(...evaluator(taskResult, task.config));
          } catch (error) {
            reject(error);
          }
        }
      }

      resolve();
    });
  }

  private async loadConfig() {
    let configPath;

    try {
      configPath =
        (await getConfigPathFromOptions(this.options.config)) || getConfigPath(this.options.cwd);
      this.config = readConfig(configPath);
    } catch (error) {
      extendedError(error);
    }
  }

  private async registerTasks() {
    let excludePaths = this.options.excludePaths || this.config.excludePaths;

    this.taskContext = Object.freeze({
      options: this.options,
      // TODO: Remove - used for backwards compat with oclif version
      cliFlags: this.options,
      cliArgs: this.options,
      parsers: getRegisteredParsers(),
      config: this.config,
      pkg: getPackageJson(this.options.cwd),
      paths: FilePathArray.from(
        await getFilePathsAsync(this.options.cwd, this.options.paths, excludePaths)
      ) as FilePathArray,
    });

    await this.forEachPlugin(
      new Map([['register-tasks', { context: this.taskContext, tasks: this.tasks }]])
    );

    __tasksForTesting.forEach((task: Task) => {
      this.tasks.registerTask(task);
    });
  }

  private async forEachPlugin(registrationTypes: Map<string, object>) {
    for (let pluginName of this.config.plugins) {
      this.debug('Loading plugin from %s', pluginName);

      for (let [registrationType, registrationArgs] of registrationTypes) {
        // TODO: Move registrations to package entry point (index.js)
        let pluginDir = dirname(resolve.sync(pluginName, { basedir: this.options.cwd }));
        let registrationPath = join(pluginDir, 'registrations', `${registrationType}.js`);

        if (existsSync(registrationPath)) {
          let register = require(registrationPath).default;

          await register(registrationArgs);

          this.debug('registration type %s', registrationType);
          this.debug('registration path %s', registrationPath);
        }
      }
    }
  }
}
