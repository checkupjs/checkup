import { JsonMetaTaskResult, TaskIdentifier } from '@checkup/core';

export default {};

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
