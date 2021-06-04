import { join } from 'path';
import {
  Action,
  CheckupError,
  CheckupConfig,
  ErrorKind,
  FilePathArray,
  getRegisteredActions,
  getConfigPath,
  getFilePathsAsync,
  getPackageJson,
  getPackageJsonSource,
  readConfig,
  RunOptions,
  Task,
  TaskContext,
  TaskActionsEvaluator,
  TaskListError,
  TaskName,
  TaskFormatter,
  RegistrationArgs,
  CheckupLogBuilder,
} from '@checkup/core';
import * as debug from 'debug';
import * as resolve from 'resolve';
import { Log, Result } from 'sarif';

import { PackageJson } from 'type-fest';
import { getLog } from '../get-log';
import TaskListImpl from '../task-list';
import PluginRegistrationProvider from './registration-provider';
export default class CheckupTaskRunner {
  actions: Action[];
  config!: CheckupConfig;
  debug: debug.Debugger;
  executedTasks!: Task[];
  options: RunOptions;
  plugins: [];
  // TODO: remove when moving to CheckupLogBuilder
  startTime: string = new Date().toJSON();
  tasks: TaskListImpl;
  taskResults: Result[];
  taskErrors: TaskListError[];
  taskContext!: TaskContext;
  logBuilder: CheckupLogBuilder;
  registeredActions: Map<string, TaskActionsEvaluator> = new Map<TaskName, TaskActionsEvaluator>();
  registeredTaskReporters: Map<string, TaskFormatter> = new Map<TaskName, TaskFormatter>();
  pkg: PackageJson;
  pkgSource: string;

  get taskErrorKind() {
    if (this.options.tasks !== undefined) {
      return ErrorKind.TasksNotFound;
    } else if (this.options.categories !== undefined) {
      return ErrorKind.TaskCategoriesNotFound;
    } else if (this.options.groups !== undefined) {
      return ErrorKind.TaskGroupsNotFound;
    }

    return ErrorKind.None;
  }

  get hasTaskFilter() {
    return [this.options.tasks, this.options.categories, this.options.groups].some(
      (taskFilterType) => taskFilterType !== undefined && taskFilterType.length > 0
    );
  }

  constructor(options: RunOptions) {
    this.debug = debug('checkup');

    this.actions = [];
    this.plugins = [];
    this.tasks = new TaskListImpl();
    this.taskResults = [];
    this.taskErrors = [];
    this.options = options;
    this.pkg = getPackageJson(this.options.cwd);
    this.pkgSource = getPackageJsonSource(this.options.cwd);
    this.logBuilder = new CheckupLogBuilder({
      packageName: this.pkg.name || '',
      packageVersion: this.pkg.version || '',
      config: this.config,
      options: this.options,
      actions: this.actions,
      errors: this.taskErrors,
    });

    this.debug('options %O', this.options);
  }

  async run(): Promise<Log> {
    await this.loadConfig();
    await this.registerPlugins();

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
    await this.registerPlugins();

    return this.tasks.fullyQualifiedTaskNames;
  }

  private async runTasks() {
    if (this.hasTaskFilter) {
      let { tasksFound, tasksNotFound } = this.findTasks();

      if (tasksFound.length > 0) {
        [this.taskResults, this.taskErrors] = await this.tasks.runTasks(tasksFound);
      }

      if (tasksNotFound.length > 0) {
        throw new CheckupError(this.taskErrorKind, { tasksNotFound });
      }

      this.executedTasks = tasksFound;
    } else {
      [this.taskResults, this.taskErrors] = await this.tasks.runTasks();
      this.executedTasks = this.tasks.getTasks();
    }
  }

  private findTasks() {
    if (this.options.tasks !== undefined && this.options.tasks.length > 0) {
      return this.tasks.findAllByTaskName(...this.options.tasks);
    } else if (this.options.categories !== undefined && this.options.categories.length > 0) {
      return this.tasks.findAllByCategory(...this.options.categories);
    } else if (this.options.groups !== undefined && this.options.groups.length > 0) {
      return this.tasks.findAllByGroup(...this.options.groups);
    }

    return { tasksFound: [], tasksNotFound: [] };
  }

  private runActions() {
    return new Promise<void>((resolve, reject) => {
      let evaluators = getRegisteredActions();

      for (let [taskName, evaluator] of evaluators) {
        let task = this.tasks.findTask(taskName);

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
    try {
      let configPath = await getConfigPath(this.options.configPath, this.options.cwd);
      this.config = this.options.config || readConfig(configPath);
    } catch (error) {
      if (error instanceof CheckupError) {
        throw error;
      }

      throw new CheckupError(ErrorKind.ConfigNotValid, { error });
    }
  }

  private async registerPlugins() {
    let excludePaths = this.options.excludePaths || this.config.excludePaths;
    let paths = FilePathArray.from(
      await getFilePathsAsync(this.options.cwd, this.options.paths || ['.'], excludePaths)
    ) as FilePathArray;

    this.logBuilder.args.paths = paths;
    this.taskContext = Object.freeze({
      options: this.options,
      config: this.config,
      logBuilder: this.logBuilder,
      pkg: this.pkg,
      pkgSource: this.pkgSource,
      paths,
    });

    await this.loadFromPlugin({
      context: this.taskContext,
      register: new PluginRegistrationProvider({
        registeredActions: this.registeredActions,
        registeredTaskReporters: this.registeredTaskReporters,
        registeredTasks: this.tasks,
      }),
    });
  }

  private async loadFromPlugin(registrationArgs: RegistrationArgs) {
    let pluginBaseDir = this.options.pluginBaseDir || this.options.cwd;

    for (let pluginName of this.config.plugins) {
      let pluginDir;

      try {
        // We first attempt to resolve from a node_modules location, which is either
        // the project's node_modules directory or an alternative location that contains
        // a node_modules.
        pluginDir = resolve.sync(pluginName, { basedir: pluginBaseDir });
      } catch {
        // If we're trying to load from a pluginBaseDir that doesn't contain a node_modules,
        // we assume we're trying to load plugins from a simple directory, and therefore
        // simply require the entry point file.
        pluginDir = join(pluginBaseDir, pluginName);
      }

      this.debug('Loading plugin from %s', pluginDir);

      let { register } = require(pluginDir);
      await register(registrationArgs);
    }
  }
}
