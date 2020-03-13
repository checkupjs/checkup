import * as t from 'io-ts';

import { JsonObject, PromiseValue } from 'type-fest';
import { RuntimeCheckupConfig, RuntimeTaskConfig } from './runtime-types';

import GradedTableData from '../report-components/graded-table-data';
import NumericalCardData from '../report-components/numerical-card-data';
import PieChartData from '../report-components/pie-chart-data';
import TableData from '../report-components/table-data';

export type CheckupConfig = t.TypeOf<typeof RuntimeCheckupConfig>;
export type TaskConfig = t.TypeOf<typeof RuntimeTaskConfig>;
export type ParserName = string;

export interface Parser {
  execute(paths: string[]): JsonObject;
}

export const enum Category {
  Meta = 'meta',
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

export enum ReporterType {
  stdout = 'stdout',
  json = 'json',
  pdf = 'pdf',
}

export type ReportResultData =
  | NumericalCardData
  | TableData
  | GradedTableData
  | PieChartData
  | undefined; //TODO: removed `undefined` once all tasks are retrofitted to return results

export enum ReportComponentType {
  NumericalCard = 'numerical-card',
  Table = 'table',
  GradedTable = 'graded-table',
  PieChart = 'pie-chart',
}

export interface TaskResult {
  stdout: () => void;
  json: () => JsonMetaTaskResult | JsonTaskResult;
  pdf: () => ReportResultData;
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

export interface DependencyResult {
  name: string;
  value: number;
  grade?: Grade;
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
