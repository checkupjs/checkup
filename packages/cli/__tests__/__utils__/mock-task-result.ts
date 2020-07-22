import { BaseTaskResult, TaskResult, TaskMetaData, TaskConfig } from '@checkup/core';

export default class MockTaskResult extends BaseTaskResult implements TaskResult {
  data: {
    result: any;
  } = { result: {} };

  constructor(public meta: TaskMetaData, public config: TaskConfig = {}) {
    super(meta, config);
  }

  process(data: { result: any }) {
    this.data = data;
  }

  toConsole() {
    process.stdout.write(`Result for ${this.meta.taskName}`);
  }

  toJson() {
    return {
      info: this.meta,
      result: this.data.result,
    };
  }
}

export function getMockTaskResult(meta: TaskMetaData, config: TaskConfig, result: any) {
  let taskResult = new MockTaskResult(meta, config);

  taskResult.process({ result });

  return taskResult;
}
