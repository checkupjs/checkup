import { MetaTaskResult } from '../../src/types';

import BaseMetaTaskResult from '../../src/base-meta-task-result';
import { TaskIdentifier } from '@checkup/core';

export default class MockMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
  constructor(meta: TaskIdentifier, public result: any) {
    super(meta);
  }

  appendCheckupProperties() {
    return {
      [this.meta.taskName]: this.result,
    };
  }
}
