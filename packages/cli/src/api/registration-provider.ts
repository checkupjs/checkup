import {
  TaskName,
  TaskActionsEvaluator,
  TaskReporter,
  ParserName,
  CreateParser,
  ParserOptions,
  Parser,
  ParserReport,
  Task,
  RegistrationProvider,
} from '@checkup/core';
import TaskListImpl from '../task-list';

export interface RegistrationProviderOptions {
  registeredActions: Map<string, TaskActionsEvaluator>;
  registeredParsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>;
  registeredTaskReporters: Map<TaskName, TaskReporter>;
  registeredTasks: TaskListImpl;
}

export default class PluginRegistrationProvider implements RegistrationProvider {
  registeredActions: Map<TaskName, TaskActionsEvaluator>;
  registeredParsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>;
  registeredTaskReporters: Map<string, TaskReporter>;
  registeredTasks: TaskListImpl;

  constructor(options: RegistrationProviderOptions) {
    this.registeredActions = options.registeredActions;
    this.registeredParsers = options.registeredParsers;
    this.registeredTaskReporters = options.registeredTaskReporters;
    this.registeredTasks = options.registeredTasks;
  }

  actions(taskName: TaskName, evaluate: TaskActionsEvaluator): void {
    this.registeredActions.set(taskName, evaluate);
  }

  parser(parserName: ParserName, parser: CreateParser<ParserOptions, Parser<ParserReport>>): void {
    this.registeredParsers.set(parserName, parser);
  }

  taskReporter(taskName: TaskName, report: TaskReporter): void {
    this.registeredTaskReporters.set(taskName, report);
  }

  task(task: Task): void {
    this.registeredTasks.registerTask(task);
  }
}
