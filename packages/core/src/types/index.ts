import * as t from 'io-ts';

import { RuntimeCheckupConfig, RuntimeTaskConfig } from './runtime-types';

import { JsonObject } from 'type-fest';

export type CheckupConfig = t.TypeOf<typeof RuntimeCheckupConfig>;
export type TaskConfig = t.TypeOf<typeof RuntimeTaskConfig>;
export type ParserName = string;

export interface Parser {
  execute(paths: string[]): JsonObject;
}

export const enum Category {
  Core,
  Migration,
  Insights,
}

export const enum Priority {
  High,
  Medium,
  Low,
}

export type TaskName = string;
export type TaskClassification = {
  category: Category;
  priority: Priority;
};

export interface Task {
  taskName: TaskName;
  friendlyTaskName: TaskName;
  taskClassification: TaskClassification;

  run: () => Promise<TaskResult>;
}

export interface TaskResult {
  toConsole: () => void;
  toJson: () => {};
}

export interface TaskMetaData {
  taskName: TaskName;
  friendlyTaskName: TaskName;
}

export interface TaskItemData {
  type: string;
  data: string[];
  total: number;
}

export type SearchPatterns = Record<string, string[]>;
