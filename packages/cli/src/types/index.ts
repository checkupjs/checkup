import {
  JsonMetaTaskResult,
  TaskIdentifier,
  RunFlags,
  TaskResult,
  TaskError,
  Action,
} from '@checkup/core';

export default {};

export interface ReporterArguments {
  flags?: RunFlags;
  info: MetaTaskResult[];
  results: TaskResult[];
  errors: TaskError[];
  actions: Action[];
}

export interface MetaTask {
  meta: TaskIdentifier;

  run: () => Promise<MetaTaskResult>;
}

export interface MetaTaskResult {
  meta: TaskIdentifier;
  toJson: () => JsonMetaTaskResult;
}

export type RepositoryInfo = {
  totalCommits: number;
  totalFiles: number;
  age: string;
  activeDays: string;
};
