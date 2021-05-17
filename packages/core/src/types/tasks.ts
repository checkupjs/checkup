import { PackageJson } from 'type-fest';
import { Result } from 'sarif';
import { FilePathArray } from '../utils/file-path-array';
import { CreateParser, Parser, ParserName, ParserOptions, ParserReport } from './parsers';

import { CheckupConfig, TaskConfig } from './config';
import { RunOptions, FormatterArgs } from './cli';

export type RegisterTaskArgs = {
  context: TaskContext;
  tasks: TaskList;
};

export type TaskActionsEvaluator = (taskResults: Result[], taskConfig: TaskConfig) => Action[];

export type TaskFormatter = (taskResults: Result[], args: FormatterArgs) => void;

interface TaskList {
  registerTask(task: Task): void;
}

export type TaskName = string;
export type TaskIdentifier = { taskName: string; taskDisplayName: string };

export interface Task {
  taskName: TaskName;
  taskDisplayName: TaskName;
  description: string;
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

export type TaskListError = {
  taskName: TaskName;
  error: Error;
};

export interface TaskContext {
  readonly options: RunOptions;
  readonly parsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>;
  readonly config: CheckupConfig;
  readonly pkg: PackageJson;
  readonly pkgSource: string;
  readonly paths: FilePathArray;
}

export enum OutputFormat {
  summary = 'summary',
  json = 'json',
  pretty = 'pretty',
}

export interface LintResult {
  filePath: string;
  lintRuleId: string | null;
  message: string;
  line: number;
  column: number;

  [key: string]: any;
}
