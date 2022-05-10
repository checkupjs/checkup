import CheckupLogParser from '../data/checkup-log-parser.js';
import {
  Task,
  TaskContext,
  TaskName,
  TaskActionsEvaluator,
  TaskFormatter,
  OutputFormat,
} from './tasks';
import { CheckupConfig } from './config.js';

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
  timings: Record<TaskName, number>;
  registerTask(task: Task): void;
}

export interface Formatter {
  format(logParser: CheckupLogParser): string;
}

export interface FormatterCtor {
  new (options: FormatterOptions): Formatter;
}

export interface FormatterOptions {
  cwd: string;
  format: OutputFormat | string;
  outputFile?: string;
}
