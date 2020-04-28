import { MetaTaskResult, TaskIdentifier } from '../../src/types';

import BaseMetaTaskResult from '../../src/base-meta-task-result';

export default class MockMetaTaskResult extends BaseMetaTaskResult implements MetaTaskResult {
  constructor(meta: TaskIdentifier, public result: any) {
    super(meta);
  }

  toConsole() {
    process.stdout.write(`Result for ${this.meta.taskName}`);
  }

  toJson() {
    return {
      [this.meta.taskName]: this.result,
    };
  }
}
