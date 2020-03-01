import * as t from 'io-ts';

import { RuntimeCheckupConfig, RuntimeTaskConfig } from './runtime-types';

import { JsonObject } from 'type-fest';

export type CheckupConfig = t.TypeOf<typeof RuntimeCheckupConfig>;
export type TaskConfig = t.TypeOf<typeof RuntimeTaskConfig>;
export type ParserName = string;

export interface Parser {
  execute(paths: string[]): JsonObject;
}

export type TaskName = string;

export interface Task {
  run: () => Promise<TaskResult>;
}

export interface TaskResult {
  toConsole: () => void;
  toJson: () => {};
}

export interface TaskItemData {
  type: string;
  data: string[];
  total: number;
}

export type SearchPatterns = Record<string, string[]>;
