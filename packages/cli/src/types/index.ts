import { TaskIdentifier, JsonMetaTaskResult } from '@checkup/core';

export default {};

export interface MetaTask {
  meta: TaskIdentifier;

  run: () => Promise<MetaTaskResult>;
}

export interface MetaTaskResult {
  meta: TaskIdentifier;
  getData: () => JsonMetaTaskResult;
}
