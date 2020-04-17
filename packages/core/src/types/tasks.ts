import GradedTableData from '../report-components/graded-table-data';
import { JsonObject } from 'type-fest';
import NumericalCardData from '../report-components/numerical-card-data';
import PieChartData from '../report-components/pie-chart-data';
import TableData from '../report-components/table-data';

export type SearchPatterns = Record<string, string[]>;

export type TaskName = string;
export type TaskClassification = {
  category: Category;
  priority: Priority;
};

export interface Task {
  meta: TaskMetaData;

  run: () => Promise<TaskResult>;
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

export interface DependencyResult {
  name: string;
  value: string;
  grade?: Grade;
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

export type ReportResultData = NumericalCardData | TableData | GradedTableData | PieChartData;

export const enum ReportComponentType {
  NumericalCard = 'numerical-card',
  Table = 'table',
  GradedTable = 'graded-table',
  PieChart = 'pie-chart',
}

export interface PieChartItem {
  value: number;
  description: string;
}
