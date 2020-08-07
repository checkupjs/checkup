import { TaskMetaData } from '@checkup/core';
import { taskResultComparator } from '../src/task-result-comparator';
import { getMockTaskResult } from './__utils__/mock-task-result';

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
      getMockTaskResult(getTaskMetaData('foo', 'linting')),
      getMockTaskResult(getTaskMetaData('fod', 'migrations')),
      getMockTaskResult(getTaskMetaData('bar', 'testing')),
      getMockTaskResult(getTaskMetaData('bag', 'best practices')),
      getMockTaskResult(getTaskMetaData('baz', 'metrics')),
      getMockTaskResult(getTaskMetaData('bad', 'dependencies')),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        Object {
          "info": Object {
            "friendlyTaskName": "baz",
            "taskClassification": Object {
              "category": "metrics",
            },
            "taskName": "baz",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bag",
            "taskClassification": Object {
              "category": "best practices",
            },
            "taskName": "bag",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bad",
            "taskClassification": Object {
              "category": "dependencies",
            },
            "taskName": "bad",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "foo",
            "taskClassification": Object {
              "category": "linting",
            },
            "taskName": "foo",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bar",
            "taskClassification": Object {
              "category": "testing",
            },
            "taskName": "bar",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
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
      getMockTaskResult(getTaskMetaData('foo', 'linting')),
      getMockTaskResult(getTaskMetaData('fod', 'testing')),
      getMockTaskResult(getTaskMetaData('bar', 'custom category2')),
      getMockTaskResult(getTaskMetaData('bar', 'custom category')),
      getMockTaskResult(getTaskMetaData('bag', 'best practices')),
      getMockTaskResult(getTaskMetaData('baz', 'metrics')),
      getMockTaskResult(getTaskMetaData('bad', 'dependencies')),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        Object {
          "info": Object {
            "friendlyTaskName": "baz",
            "taskClassification": Object {
              "category": "metrics",
            },
            "taskName": "baz",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bag",
            "taskClassification": Object {
              "category": "best practices",
            },
            "taskName": "bag",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bad",
            "taskClassification": Object {
              "category": "dependencies",
            },
            "taskName": "bad",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "foo",
            "taskClassification": Object {
              "category": "linting",
            },
            "taskName": "foo",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "fod",
            "taskClassification": Object {
              "category": "testing",
            },
            "taskName": "fod",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bar",
            "taskClassification": Object {
              "category": "custom category2",
            },
            "taskName": "bar",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
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
      getMockTaskResult(getTaskMetaData('foo', 'linting')),
      getMockTaskResult(getTaskMetaData('fod', 'best practices', 'lint')),
      getMockTaskResult(getTaskMetaData('bar', 'best practices')),
      getMockTaskResult(getTaskMetaData('baz', 'metrics')),
      getMockTaskResult(getTaskMetaData('bag', 'dependencies')),
      getMockTaskResult(getTaskMetaData('bad', 'best practices', 'lint')),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        Object {
          "info": Object {
            "friendlyTaskName": "baz",
            "taskClassification": Object {
              "category": "metrics",
            },
            "taskName": "baz",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "fod",
            "taskClassification": Object {
              "category": "best practices",
              "group": "lint",
            },
            "taskName": "fod",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bad",
            "taskClassification": Object {
              "category": "best practices",
              "group": "lint",
            },
            "taskName": "bad",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bar",
            "taskClassification": Object {
              "category": "best practices",
            },
            "taskName": "bar",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bag",
            "taskClassification": Object {
              "category": "dependencies",
            },
            "taskName": "bag",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
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
      getMockTaskResult(getTaskMetaData('foo', 'linting')),
      getMockTaskResult(getTaskMetaData('fod', 'grouped linting', 'lint')),
      getMockTaskResult(getTaskMetaData('bar', 'best practices')),
      getMockTaskResult(getTaskMetaData('baz', 'metrics')),
      getMockTaskResult(getTaskMetaData('bad', 'dependencies')),
      getMockTaskResult(getTaskMetaData('bag', 'grouped linting2', 'lint')),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        Object {
          "info": Object {
            "friendlyTaskName": "baz",
            "taskClassification": Object {
              "category": "metrics",
            },
            "taskName": "baz",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bar",
            "taskClassification": Object {
              "category": "best practices",
            },
            "taskName": "bar",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "bad",
            "taskClassification": Object {
              "category": "dependencies",
            },
            "taskName": "bad",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "foo",
            "taskClassification": Object {
              "category": "linting",
            },
            "taskName": "foo",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "friendlyTaskName": "fod",
            "taskClassification": Object {
              "category": "grouped linting",
              "group": "lint",
            },
            "taskName": "fod",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
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
