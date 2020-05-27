import { CreateParser, Parser, ParserName, ParserOptions, ParserReport } from './parsers';
import { JsonObject, PackageJson } from 'type-fest';
import { RunFlags } from './cli';

import { CheckupConfig } from './config';
import NumericalCardData from '../report-components/numerical-card-data';
import PieChartData from '../report-components/pie-chart-data';
import TableData from '../report-components/table-data';

export type SearchPatterns = Record<string, string[]>;

export type TaskName = string;
export type TaskIdentifier = { taskName: string; friendlyTaskName: string };
export type TaskClassification = {
  category: Category;
  priority: Priority;
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
  readonly paths: string[];
}

export interface TaskResult {
  toConsole: () => void;
  toJson: () => JsonMetaTaskResult | JsonTaskResult;
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

export const enum Category {
  Insights = 'insights',
  Migrations = 'migrations',
  Recommendations = 'recommendations',
}

export const enum Priority {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export interface TableResult {
  name: string;
  value: string | number;
  grade?: Grade;
}

export type JsonMetaTaskResult = JsonObject;

export type JsonTaskResult = {
  meta: TaskMetaData;
  result: {};
};

export type ReportResultData = NumericalCardData | TableData | PieChartData;

export type UIResultData = {
  [key in Category]: {
    [key in Priority]: ReportResultData[];
  };
};

export type UIReportData = {
  meta: JsonMetaTaskResult;
  results: UIResultData;
  requiresChart: boolean;
};

export const enum ReportComponentType {
  NumericalCard = 'numerical-card',
  Table = 'table',
  PieChart = 'pie-chart',
}

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

export interface PieChartItem {
  value: number;
  description: string;
}
