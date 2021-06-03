import { PackageJson } from 'type-fest';
import { PropertyBag, Result } from 'sarif';
import { FilePathArray } from '../utils/file-path-array';
import CheckupLogBuilder from '../data/checkup-log-builder';
import { CheckupConfig, TaskConfig } from './config';
import { RunOptions, FormatterArgs } from './cli';
import { RequiredResult } from './checkup-log';

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

export type TaskResultKind = Result.kind;
export type TaskResultLevel = Result.level;
export type TaskResultLocation = {
  uri: string;
  startColumn: number;
  startLine: number;
};
export type TaskResultProperties = PropertyBag;

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

  addResult: (
    messageText: string,
    kind: TaskResultKind,
    level: TaskResultLevel,
    location?: TaskResultLocation,
    properties?: TaskResultProperties
  ) => RequiredResult;
}

export type ActionItem = string | string[] | { columns: string[]; rows: object[] };

export interface Action {
  taskName: string;
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
  readonly config: CheckupConfig;
  readonly logBuilder: CheckupLogBuilder;
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
