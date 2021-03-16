import { CreateParser, Parser, ParserName, ParserOptions, ParserReport } from './parsers';
import { PackageJson } from 'type-fest';

import { CheckupConfig, TaskConfig } from './config';
import { FilePathArray } from '../utils/file-path-array';
import { RunFlags, RunOptions } from './cli';
import { Result } from 'sarif';

export type RegisterTaskArgs = {
  context: TaskContext;
  tasks: TaskList;
};

export type RegisterActionsArgs = {
  registerActions: (taskName: TaskName, evaluate: TaskActionsEvaluator) => void;
};
export type TaskActionsEvaluator = (taskResults: Result[], taskConfig: TaskConfig) => Action[];

export type RegisterTaskReporterArgs = {
  registerTaskReporter: (taskName: TaskName, report: TaskReporter) => void;
};
export type TaskReporter = (taskResults: Result[]) => void;

interface TaskList {
  registerTask(task: Task): void;
}

export type TaskName = string;
export type TaskIdentifier = { taskName: string; taskDisplayName: string };

export interface Task {
  taskName: TaskName;
  taskDisplayName: TaskName;
  config: TaskConfig;
  category: string;
  group?: string;

  readonly fullyQualifiedTaskName: string;
  readonly enabled: boolean;

  run: () => Promise<Result[]>;
}

export type ActionItem = string | string[] | { columns: string[]; rows: object[] };

export interface Action {
  name: string;
  summary: string;
  details: string;
  defaultThreshold: number;

  items: ActionItem[];
  input: number;
}

export type TaskError = {
  taskName: TaskName;
  error: Error;
};

export interface TaskContext {
  readonly cliArguments: string[];
  readonly cliFlags: RunFlags;
  readonly parsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>;
  readonly config: CheckupConfig;
  readonly pkg: PackageJson;
  readonly paths: FilePathArray;
}
export interface TaskContext2 {
  readonly options: RunOptions;
  readonly parsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>;
  readonly config: CheckupConfig;
  readonly pkg: PackageJson;
  readonly paths: FilePathArray;
}

export enum OutputFormat {
  stdout = 'stdout',
  json = 'json',
}

export interface LintResult {
  filePath: string;
  lintRuleId: string | null;
  message: string;
  line: number;
  column: number;

  [key: string]: any;
}
