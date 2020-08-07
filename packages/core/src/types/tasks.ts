import { CreateParser, Parser, ParserName, ParserOptions, ParserReport } from './parsers';
import { JsonObject, PackageJson } from 'type-fest';

import { TaskResult } from './checkup-result';
import { CheckupConfig, TaskConfig } from './config';
import { FilePathArray } from '../utils/file-path-array';
import { RunFlags } from './cli';

export type RegisterTaskArgs = {
  context: TaskContext;
  tasks: TaskList;
};

export type RegisterActionsArgs = {
  registerActions: (taskName: TaskName, evaluate: TaskActionsEvaluator) => void;
};
export type TaskActionsEvaluator = (taskResult: TaskResult, taskConfig: TaskConfig) => Action[];

export type RegisterTaskReporterArgs = {
  registerTaskReporter: (taskName: TaskName, report: TaskReporter) => void;
};
export type TaskReporter = (taskResult: TaskResult) => void;

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

  run: () => Promise<TaskResult>;
  toJson: <T>(data: T) => TaskResult;
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
  error: string;
};

export interface TaskContext {
  readonly cliArguments: string[];
  readonly cliFlags: RunFlags;
  readonly parsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>;
  readonly config: CheckupConfig;
  readonly pkg: PackageJson;
  readonly paths: FilePathArray;
}

export type JsonMetaTaskResult = JsonObject;

export enum OutputFormat {
  stdout = 'stdout',
  json = 'json',
}

export interface LintResult {
  filePath: string;
  ruleId: string | null;
  message: string;
  line: number;
  column: number;

  [key: string]: any;
}
