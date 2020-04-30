import { TaskIdentifier } from '@checkup/core';

export default abstract class BaseMetaTaskResult {
  meta: TaskIdentifier;

  constructor(meta: TaskIdentifier) {
    this.meta = meta;
  }
}
