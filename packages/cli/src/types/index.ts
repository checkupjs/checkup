import { JsonMetaTaskResult } from '@checkup/core';

export default {};

export type TaskIdentifier = { taskName: string; friendlyTaskName: string };

export interface MetaTask {
  meta: TaskIdentifier;

  run: () => Promise<MetaTaskResult>;
}

export interface MetaTaskResult {
  toConsole: () => void;
  json: () => JsonMetaTaskResult;
}

export const enum TestType {
  Application = 'application',
  Container = 'container',
  Rendering = 'rendering',
  Unit = 'unit',
}

export type RepositoryInfo = {
  totalCommits: number;
  totalFiles: number;
  age: string;
  activeDays: string;
};
