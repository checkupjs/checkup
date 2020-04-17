import { Category, Priority, TaskResult } from '@checkup/core';

import { MetaTaskResult } from '../src/types';
import MockMetaTaskResult from './__utils__/mock-meta-task-result';
import MockTaskResult from './__utils__/mock-task-result';
import MockPieChartTaskResult from './__utils__/mock-pie-chart-task-result';
import { _transformJsonResults, _transformPdfResults } from '../src/reporters';

let metaTaskResults: MetaTaskResult[];
let pluginTaskResults: TaskResult[];

metaTaskResults = [
  new MockMetaTaskResult(
    {
      taskName: 'mock-meta-task-1',
      friendlyTaskName: 'Mock Meta Task 1',
    },
    {
      foo: true,
      bar: 'baz',
    }
  ),
  new MockMetaTaskResult(
    {
      taskName: 'mock-meta-task-2',
      friendlyTaskName: 'Mock Meta Task 2',
    },
    {
      blarg: false,
      bleek: { bork: 'bye!' },
    }
  ),
];

pluginTaskResults = [
  new MockTaskResult(
    {
      taskName: 'mock-meta-task-6',
      friendlyTaskName: 'Mock Meta Task 6',
      taskClassification: {
        category: Category.Insights,
        priority: Priority.Low,
      },
    },
    {
      foo: true,
      bar: 'baz',
    }
  ),
  new MockTaskResult(
    {
      taskName: 'mock-meta-task-7',
      friendlyTaskName: 'Mock Meta Task 7',
      taskClassification: {
        category: Category.Migrations,
        priority: Priority.High,
      },
    },
    {
      foo: true,
      bar: 'baz',
    }
  ),
  new MockTaskResult(
    {
      taskName: 'mock-meta-task-3',
      friendlyTaskName: 'Mock Meta Task 3',
      taskClassification: {
        category: Category.Insights,
        priority: Priority.High,
      },
    },
    {
      foo: true,
      bar: 'baz',
    }
  ),
  new MockTaskResult(
    {
      taskName: 'mock-meta-task-5',
      friendlyTaskName: 'Mock Meta Task 5',
      taskClassification: {
        category: Category.Insights,
        priority: Priority.High,
      },
    },
    {
      foo: true,
      bar: 'baz',
    }
  ),
  new MockTaskResult(
    {
      taskName: 'mock-meta-task-8',
      friendlyTaskName: 'Mock Meta Task 8',
      taskClassification: {
        category: Category.Migrations,
        priority: Priority.Low,
      },
    },
    {
      foo: true,
      bar: 'baz',
    }
  ),
  new MockTaskResult(
    {
      taskName: 'mock-meta-task-4',
      friendlyTaskName: 'Mock Meta Task 4',
      taskClassification: {
        category: Category.Insights,
        priority: Priority.Medium,
      },
    },
    {
      foo: true,
      bar: 'baz',
    }
  ),
];

describe('_transformJsonResults', () => {
  it('transforms meta and plugin results into correct format', () => {
    let transformed = _transformJsonResults(metaTaskResults, pluginTaskResults);

    expect(transformed).toMatchInlineSnapshot(`
      Object {
        "meta": Object {
          "mock-meta-task-1": Object {
            "bar": "baz",
            "foo": true,
          },
          "mock-meta-task-2": Object {
            "blarg": false,
            "bleek": Object {
              "bork": "bye!",
            },
          },
        },
        "results": Array [
          Object {
            "meta": Object {
              "friendlyTaskName": "Mock Meta Task 6",
              "taskClassification": Object {
                "category": "insights",
                "priority": "low",
              },
              "taskName": "mock-meta-task-6",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
          Object {
            "meta": Object {
              "friendlyTaskName": "Mock Meta Task 7",
              "taskClassification": Object {
                "category": "migrations",
                "priority": "high",
              },
              "taskName": "mock-meta-task-7",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
          Object {
            "meta": Object {
              "friendlyTaskName": "Mock Meta Task 3",
              "taskClassification": Object {
                "category": "insights",
                "priority": "high",
              },
              "taskName": "mock-meta-task-3",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
          Object {
            "meta": Object {
              "friendlyTaskName": "Mock Meta Task 5",
              "taskClassification": Object {
                "category": "insights",
                "priority": "high",
              },
              "taskName": "mock-meta-task-5",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
          Object {
            "meta": Object {
              "friendlyTaskName": "Mock Meta Task 8",
              "taskClassification": Object {
                "category": "migrations",
                "priority": "low",
              },
              "taskName": "mock-meta-task-8",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
          Object {
            "meta": Object {
              "friendlyTaskName": "Mock Meta Task 4",
              "taskClassification": Object {
                "category": "insights",
                "priority": "medium",
              },
              "taskName": "mock-meta-task-4",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
        ],
      }
    `);
  });
});

describe('_transformPdfResults', () => {
  it('transforms meta and plugin results into correct format when chart is not required', () => {
    let transformed = _transformPdfResults(metaTaskResults, pluginTaskResults);

    expect(transformed).toMatchSnapshot();
  });
  it('transforms meta and plugin results into correct format when chart IS required', () => {
    let transformed = _transformPdfResults(metaTaskResults, [
      new MockPieChartTaskResult(
        {
          taskName: 'mock-meta-task-8',
          friendlyTaskName: 'Mock Meta Task 8',
          taskClassification: {
            category: Category.Migrations,
            priority: Priority.Low,
          },
        },
        {
          foo: true,
          bar: 'baz',
        }
      ),
    ]);

    expect(transformed).toMatchSnapshot();
  });
});
