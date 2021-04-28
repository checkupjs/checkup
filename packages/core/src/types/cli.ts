import { ConsoleWriter } from '../utils/console-writer';
import {
  Task,
  TaskContext,
  TaskName,
  TaskActionsEvaluator,
  TaskFormatter,
  OutputFormat,
} from './tasks';
import { ParserName, CreateParser, ParserOptions, Parser, ParserReport } from './parsers';
import { CheckupConfig } from './config';

export type RunOptions = {
  cwd: string;
  config?: CheckupConfig;
  configPath?: string;
  categories?: string[];
  excludePaths?: string[];
  groups?: string[];
  listTasks?: boolean;
  paths?: string[];
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

export interface FormatterOptions {
  cwd: string;
  format: OutputFormat;
  outputFile?: string;
}

export type FormatterArgs = FormatterOptions & { writer: ConsoleWriter };
