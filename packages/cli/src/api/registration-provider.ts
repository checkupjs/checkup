import {
  TaskName,
  TaskActionsEvaluator,
  TaskFormatter,
  ParserName,
  CreateParser,
  ParserOptions,
  Parser,
  ParserReport,
  Task,
  RegistrationProvider,
  RegistrationProviderOptions,
  RegisterableTaskList,
} from '@checkup/core';

export default class PluginRegistrationProvider implements RegistrationProvider {
  registeredActions: Map<TaskName, TaskActionsEvaluator>;
  registeredParsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>;
  registeredTaskReporters: Map<string, TaskFormatter>;
  registeredTasks: RegisterableTaskList;

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

  taskFormatter(taskName: TaskName, report: TaskFormatter): void {
    this.registeredTaskReporters.set(taskName, report);
  }

  task(task: Task): void {
    this.registeredTasks.registerTask(task);
  }
}
