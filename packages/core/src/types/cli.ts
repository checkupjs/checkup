import { Task, TaskContext, TaskName, TaskActionsEvaluator, TaskFormatter } from './tasks';
import { ParserName, CreateParser, ParserOptions, Parser, ParserReport } from './parsers';

export type RunFlags = {
  version: void;
  help: void;
  config: string | undefined;
  cwd: string;
  category: string[] | undefined;
  group: string[] | undefined;
  task: string[] | undefined;
  'list-tasks': boolean;
  format: string;
  'output-file': string;
  'exclude-paths': string[] | undefined;
  verbose: boolean;
};

export type RunOptions = {
  cwd: string;
  config?: string;
  categories?: string[];
  excludePaths?: string[];
  format: string;
  groups?: string[];
  listTasks?: boolean;
  outputFile: string;
  paths: string[];
  tasks?: string[];
};

export interface RegistrationArgs {
  context: TaskContext;
  register: RegistrationProvider;
}

export interface RegistrationProvider {
  actions(taskName: TaskName, evaluate: TaskActionsEvaluator): void;
  parser(parserName: ParserName, parser: CreateParser<ParserOptions, Parser<ParserReport>>): void;
  taskFormatter(taskName: TaskName, report: TaskFormatter): void;
  task(task: Task): void;
}

export interface RegistrationProviderOptions {
  registeredActions: Map<string, TaskActionsEvaluator>;
  registeredParsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>;
  registeredTaskReporters: Map<TaskName, TaskFormatter>;
  registeredTasks: RegisterableTaskList;
}
export interface RegisterableTaskList {
  registerTask(task: Task): void;
}
