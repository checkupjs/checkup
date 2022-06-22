import CheckupLogParser from '../data/checkup-log-parser.js';
import { Task, TaskName, OutputFormat } from './tasks';
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

export interface RegisterableTaskList {
  timings: Record<TaskName, number>;
  registerTask(task: Task): void;
}

export interface Formatter {
  shouldWrite: boolean;
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
