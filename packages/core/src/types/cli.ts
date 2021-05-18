import { ConsoleWriter } from '../utils/console-writer';
import {
  Task,
  TaskContext,
  TaskName,
  TaskActionsEvaluator,
  TaskFormatter,
  OutputFormat,
} from './tasks';
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
  pluginBaseDir?: string;
};

export interface RegistrationArgs {
  context: TaskContext;
  register: RegistrationProvider;
}

export interface RegistrationProvider {
  actions(taskName: TaskName, evaluate: TaskActionsEvaluator): void;
  taskFormatter(taskName: TaskName, report: TaskFormatter): void;
  task(task: Task): void;
}

export interface RegistrationProviderOptions {
  registeredActions: Map<string, TaskActionsEvaluator>;
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
