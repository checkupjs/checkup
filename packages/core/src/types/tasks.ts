import { CreateParser, Parser, ParserName, ParserOptions, ParserReport } from './parsers';
import { JsonObject, PackageJson } from 'type-fest';

import { CheckupConfig } from './config';
import { FilePathsArray } from '../utils/file-paths-array';
import { RunFlags } from './cli';

export type SearchPatterns = Record<string, string[]>;

export type RegisterTaskArgs = {
  context: TaskContext;
  tasks: TaskList;
};

interface TaskList {
  registerTask(task: Task): void;
}

export type TaskName = string;
export type TaskIdentifier = { taskName: string; friendlyTaskName: string };
export type TaskClassification = {
  group?: string;
  category: string;
};

export interface Task {
  meta: TaskMetaData;
  readonly fullyQualifiedTaskName: string;
  readonly enabled: boolean;

  run: () => Promise<TaskResult>;
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

export interface TaskResult {
  meta: TaskMetaData;
  data: Record<string, any>;
  actions?: Action[];

  process(data: Record<string, any>): void;
  toConsole: () => void;
  toJson: () => JsonMetaTaskResult | JsonTaskResult;
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
  readonly paths: FilePathsArray;
}

export interface TaskMetaData {
  taskName: TaskName;
  friendlyTaskName: TaskName;
  taskClassification: TaskClassification;
}

export interface TaskItemData {
  displayName: string;
  type: string;
  data: string[] | Record<string, string>;
  total: number;
}

export type JsonMetaTaskResult = JsonObject;

export type JsonTaskResult = {
  meta: TaskMetaData;
  result: {};
};

export enum OutputFormat {
  stdout = 'stdout',
  json = 'json',
}
