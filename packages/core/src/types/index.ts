import { RuntimeCheckupConfig, RuntimeTaskConfig } from './runtime-types';
import * as t from 'io-ts';

export interface HooksConfig {
  registerTask(taskName: string, task: TaskConstructor): void;
}

export type CheckupConfig = t.TypeOf<typeof RuntimeCheckupConfig>;
export type TaskConfig = t.TypeOf<typeof RuntimeTaskConfig>;

export type TaskName = string;

export interface Task {
  run: () => Promise<TaskResult>;
}

export interface TaskConstructor {
  new (args: any): Task;
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
