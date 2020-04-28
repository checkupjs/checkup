import {
  BaseTaskResult,
  Category,
  PieChartData,
  Priority,
  TaskMetaData,
  TaskResult,
} from '@checkup/core';

export default class MockTaskResult extends BaseTaskResult implements TaskResult {
  constructor(meta: TaskMetaData, public result: any) {
    super(meta);
  }

  toConsole() {
    process.stdout.write(`Result for ${this.meta.taskName}`);
  }

  toJson() {
    return {
      meta: this.meta,
      result: this.result,
    };
  }

  toReportData() {
    return [
      new PieChartData(
        {
          taskName: 'mock-task',
          friendlyTaskName: 'Mock Task',
          taskClassification: {
            category: Category.Insights,
            priority: Priority.Medium,
          },
        },
        [
          { value: 33, description: 'blah' },
          { value: 23, description: 'blah' },
          { value: 13, description: 'black' },
          { value: 3, description: 'sheep' },
        ],
        'this is a chart',
        100
      ),
    ];
  }
}
