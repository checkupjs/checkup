import { CreateParser, Parser, ParserName, ParserOptions, ParserReport } from './parsers';
import { FilePathsArray } from '../utils/file-paths-array';
import { JsonObject, PackageJson } from 'type-fest';

import { CheckupConfig } from './config';
import { RunFlags } from './cli';

export type SearchPatterns = Record<string, string[]>;

export type TaskName = string;
export type TaskIdentifier = { taskName: string; friendlyTaskName: string };
export type TaskClassification = {
  taskType: TaskType;
  category: string;
};

export interface Task {
  meta: TaskMetaData;
  readonly enabled: boolean;

  run: () => Promise<TaskResult>;
}

export interface TaskContext {
  readonly cliArguments: string[];
  readonly cliFlags: RunFlags;
  readonly parsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>;
  readonly config: CheckupConfig;
  readonly pkg: PackageJson;
  readonly paths: FilePathsArray;
}

export interface TaskResult {
  toConsole: () => void;
  toJson: () => JsonMetaTaskResult | JsonTaskResult;
}

export type TaskError = {
  taskName: TaskName;
  error: string;
};

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

export const enum TaskType {
  Insights = 'insights',
  Migrations = 'migrations',
  Recommendations = 'recommendations',
}

export type JsonMetaTaskResult = JsonObject;

export type JsonTaskResult = {
  meta: TaskMetaData;
  result: {};
};

export const enum Grade {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  F = 'F',
}

export enum OutputFormat {
  stdout = 'stdout',
  json = 'json',
}
