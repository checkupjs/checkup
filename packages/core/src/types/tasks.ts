import { PackageJson, SetOptional } from 'type-fest';
import { PropertyBag, ReportingDescriptor, Result } from 'sarif';
import { FilePathArray } from '../utils/file-path-array';
import CheckupLogBuilder from '../data/checkup-log-builder';
import BaseOutputWriter from '../utils/base-output-writer';
import { CheckupConfig, TaskConfig } from './config';
import { RunOptions } from './cli';
import { RequiredResult } from './checkup-log';

export type RegisterTaskArgs = {
  context: TaskContext;
  tasks: TaskList;
};

export type TaskActionsEvaluator = (taskResults: Result[], taskConfig: TaskConfig) => TaskAction[];

export type TaskFormatter = (taskResults: Result[], writer: BaseOutputWriter) => void;

interface TaskList {
  registerTask(task: Task): void;
}

export type TaskName = string;
export type TaskIdentifier = { taskName: string; taskDisplayName: string };

export type TaskResultKind = Result.kind;
export type TaskResultLevel = Result.level;
export type TaskResultLocation = {
  uri: string;
  startLine?: number;
  startColumn?: number;
  endLine?: number;
  endColumn?: number;
};
export type TaskResultProperties = PropertyBag;
export type TaskRule = SetOptional<ReportingDescriptor, 'id'>;
export type TaskResultOptions = {
  location?: TaskResultLocation;
  properties?: TaskResultProperties;
  rule?: TaskRule;
};

export interface Task {
  taskName: TaskName;
  taskDisplayName: TaskName;
  description: string;
  config: TaskConfig;
  results: Result[];
  category: string;
  group?: string;

  readonly fullyQualifiedTaskName: string;
  readonly enabled: boolean;

  run: () => Promise<Result[]>;

  addResult: (
    messageText: string,
    kind: TaskResultKind,
    level: TaskResultLevel,
    options?: TaskResultOptions
  ) => RequiredResult;
}

export type TaskActionItem = string | string[] | { columns: string[]; rows: object[] };

export interface TaskAction {
  taskName: string;
  name: string;
  summary: string;
  details: string;
  defaultThreshold: number;

  items: TaskActionItem[];
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
}

export interface NormalizedLintResult {
  filePath: string;
  lintRuleId: string | null;
  message: string;
  line: number;
  column: number;
  endLine: number;
  endColumn: number;

  [key: string]: any;
}
