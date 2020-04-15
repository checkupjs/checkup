import { BaseTask, Category, Priority, Task, TaskMetaData, TaskResult } from '@checkup/core';

import MockTaskResult from './mock-task-result';

const DEFAULT_META = {
  taskName: 'mock-task',
  friendlyTaskName: 'Mock Task',
  taskClassification: {
    category: Category.Insights,
    priority: Priority.High,
  },
};

export default class MockTask extends BaseTask implements Task {
  meta: TaskMetaData;

  constructor(meta: TaskMetaData = DEFAULT_META) {
    super({});
    this.meta = meta;
  }

  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, `${this.meta.taskName} is being run`);
  }
}
