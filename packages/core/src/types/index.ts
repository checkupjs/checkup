import * as t from 'io-ts';

import { JsonObject, PromiseValue } from 'type-fest';
import { RuntimeCheckupConfig, RuntimeTaskConfig } from './runtime-types';
import CardData from '../pdf-components/card-data';

export type CheckupConfig = t.TypeOf<typeof RuntimeCheckupConfig>;
export type TaskConfig = t.TypeOf<typeof RuntimeTaskConfig>;
export type ParserName = string;

export interface Parser {
  execute(paths: string[]): JsonObject;
}

export const enum Category {
  Core = 'core',
  Migration = 'migration',
  Insights = 'insights',
}

export const enum Priority {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}
export type TaskName = string;
export type TaskClassification = {
  category: Category;
  priority: Priority;
};

export interface Task {
  meta: TaskMetaData;

  run: () => Promise<TaskResult>;
}

export type JsonTaskResult = {
  meta: TaskMetaData;
  result: {};
};

export enum ReporterType {
  stdout = 'stdout',
  json = 'json',
  pdf = 'pdf',
}

export interface TaskResult {
  stdout: () => void;
  json: () => JsonTaskResult;
  pdf: () => CardData | undefined;
}

export interface TaskMetaData {
  taskName: TaskName;
  friendlyTaskName: TaskName;
  taskClassification: TaskClassification;
}

export interface TaskItemData {
  type: string;
  data: string[];
  total: number;
}

export type SearchPatterns = Record<string, string[]>;

export enum CheckupConfigFormat {
  JSON = 'JSON',
  YAML = 'YAML',
  JavaScript = 'JavaScript',
}

export type CheckupConfigLoader = () => Promise<{
  format: CheckupConfigFormat;
  filepath: string;
  config: CheckupConfig;
}>;

export type ConfigMapper = (config: CheckupConfig) => CheckupConfig;

export type CosmiconfigServiceResult = PromiseValue<ReturnType<CheckupConfigLoader>> | null;
