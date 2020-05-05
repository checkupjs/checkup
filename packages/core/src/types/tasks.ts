import { CreateParser, Parser, ParserName, ParserOptions, ParserReport } from './parsers';
import { RunArgs, RunFlags } from './cli';

import { CheckupConfig } from './configuration';
import { JsonObject } from 'type-fest';
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
  cliArguments: RunArgs;
  cliFlags: RunFlags;
  parsers: Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>;
  config: CheckupConfig;
}

export interface TaskResult {
  toConsole: () => void;
  toJson: () => JsonMetaTaskResult | JsonTaskResult;
  toReportData: () => ReportResultData[];
}

export interface TaskMetaData {
  taskName: TaskName;
  friendlyTaskName: TaskName;
  taskClassification: TaskClassification;
}

export interface TaskItemData {
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

export enum ReporterType {
  stdout = 'stdout',
  json = 'json',
  html = 'html',
}

export interface PieChartItem {
  value: number;
  description: string;
}
