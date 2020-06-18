import MockTaskResult from './__utils__/mock-task-result';
import { TaskMetaData } from '@checkup/core';
import { taskResultComparator } from '../src/task-result-comparator';

function getTaskMetaData(taskName: string, category: string, group: string = ''): TaskMetaData {
  let taskMetaData: TaskMetaData = {
    taskName,
    friendlyTaskName: taskName,
    taskClassification: {
      category,
    },
  };

  if (group) {
    taskMetaData.taskClassification.group = group;
  }

  return taskMetaData;
}

describe('taskResultComparator', () => {
  it('should sort task results by category with no group', () => {
    let results = [
      new MockTaskResult(getTaskMetaData('foo', 'linting'), {}, {}),
      new MockTaskResult(getTaskMetaData('fod', 'migrations'), {}, {}),
      new MockTaskResult(getTaskMetaData('bar', 'testing'), {}, {}),
      new MockTaskResult(getTaskMetaData('bag', 'best practices'), {}, {}),
      new MockTaskResult(getTaskMetaData('baz', 'metrics'), {}, {}),
      new MockTaskResult(getTaskMetaData('bad', 'dependencies'), {}, {}),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "baz",
            "taskClassification": Object {
              "category": "metrics",
            },
            "taskName": "baz",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bag",
            "taskClassification": Object {
              "category": "best practices",
            },
            "taskName": "bag",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bad",
            "taskClassification": Object {
              "category": "dependencies",
            },
            "taskName": "bad",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "foo",
            "taskClassification": Object {
              "category": "linting",
            },
            "taskName": "foo",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bar",
            "taskClassification": Object {
              "category": "testing",
            },
            "taskName": "bar",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "fod",
            "taskClassification": Object {
              "category": "migrations",
            },
            "taskName": "fod",
          },
          "result": Object {},
        },
      ]
    `);
  });

  it('should sort task results with custom category by category with no group', () => {
    let results = [
      new MockTaskResult(getTaskMetaData('foo', 'linting'), {}, {}),
      new MockTaskResult(getTaskMetaData('fod', 'testing'), {}, {}),
      new MockTaskResult(getTaskMetaData('bar', 'custom category2'), {}, {}),
      new MockTaskResult(getTaskMetaData('bar', 'custom category'), {}, {}),
      new MockTaskResult(getTaskMetaData('bag', 'best practices'), {}, {}),
      new MockTaskResult(getTaskMetaData('baz', 'metrics'), {}, {}),
      new MockTaskResult(getTaskMetaData('bad', 'dependencies'), {}, {}),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "baz",
            "taskClassification": Object {
              "category": "metrics",
            },
            "taskName": "baz",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bag",
            "taskClassification": Object {
              "category": "best practices",
            },
            "taskName": "bag",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bad",
            "taskClassification": Object {
              "category": "dependencies",
            },
            "taskName": "bad",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "foo",
            "taskClassification": Object {
              "category": "linting",
            },
            "taskName": "foo",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "fod",
            "taskClassification": Object {
              "category": "testing",
            },
            "taskName": "fod",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bar",
            "taskClassification": Object {
              "category": "custom category2",
            },
            "taskName": "bar",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bar",
            "taskClassification": Object {
              "category": "custom category",
            },
            "taskName": "bar",
          },
          "result": Object {},
        },
      ]
    `);
  });

  it('should sort task results by category with group', () => {
    let results = [
      new MockTaskResult(getTaskMetaData('foo', 'linting'), {}, {}),
      new MockTaskResult(getTaskMetaData('fod', 'best practices', 'lint'), {}, {}),
      new MockTaskResult(getTaskMetaData('bar', 'best practices'), {}, {}),
      new MockTaskResult(getTaskMetaData('baz', 'metrics'), {}, {}),
      new MockTaskResult(getTaskMetaData('bag', 'dependencies'), {}, {}),
      new MockTaskResult(getTaskMetaData('bad', 'best practices', 'lint'), {}, {}),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "baz",
            "taskClassification": Object {
              "category": "metrics",
            },
            "taskName": "baz",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "fod",
            "taskClassification": Object {
              "category": "best practices",
              "group": "lint",
            },
            "taskName": "fod",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bad",
            "taskClassification": Object {
              "category": "best practices",
              "group": "lint",
            },
            "taskName": "bad",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bar",
            "taskClassification": Object {
              "category": "best practices",
            },
            "taskName": "bar",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bag",
            "taskClassification": Object {
              "category": "dependencies",
            },
            "taskName": "bag",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "foo",
            "taskClassification": Object {
              "category": "linting",
            },
            "taskName": "foo",
          },
          "result": Object {},
        },
      ]
    `);
  });

  it('should sort task results with custom category by category with group', () => {
    let results = [
      new MockTaskResult(getTaskMetaData('foo', 'linting'), {}, {}),
      new MockTaskResult(getTaskMetaData('fod', 'grouped linting', 'lint'), {}, {}),
      new MockTaskResult(getTaskMetaData('bar', 'best practices'), {}, {}),
      new MockTaskResult(getTaskMetaData('baz', 'metrics'), {}, {}),
      new MockTaskResult(getTaskMetaData('bad', 'dependencies'), {}, {}),
      new MockTaskResult(getTaskMetaData('bag', 'grouped linting2', 'lint'), {}, {}),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "baz",
            "taskClassification": Object {
              "category": "metrics",
            },
            "taskName": "baz",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bar",
            "taskClassification": Object {
              "category": "best practices",
            },
            "taskName": "bar",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bad",
            "taskClassification": Object {
              "category": "dependencies",
            },
            "taskName": "bad",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "foo",
            "taskClassification": Object {
              "category": "linting",
            },
            "taskName": "foo",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "fod",
            "taskClassification": Object {
              "category": "grouped linting",
              "group": "lint",
            },
            "taskName": "fod",
          },
          "result": Object {},
        },
        MockTaskResult {
          "config": Object {},
          "meta": Object {
            "friendlyTaskName": "bag",
            "taskClassification": Object {
              "category": "grouped linting2",
              "group": "lint",
            },
            "taskName": "bag",
          },
          "result": Object {},
        },
      ]
    `);
  });
});
