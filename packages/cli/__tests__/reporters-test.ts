import { Category, Priority, TaskResult } from '@checkup/core';

import { _transformResults } from '../src/reporters';
import { createMockTaskResult } from '@checkup/test-helpers';

describe('_transformResults', () => {
  let metaTaskResults: TaskResult[];
  let pluginTaskResults: TaskResult[];

  it('transforms meta and plugin results into correct format', () => {
    metaTaskResults = [
      createMockTaskResult('mock-meta-task-1', 'Mock Meta Task 1', Category.Meta, Priority.High, {
        task1: {
          foo: true,
          bar: 'baz',
        },
      }),
      createMockTaskResult('mock-meta-task-2', 'Mock Meta Task 2', Category.Meta, Priority.High, {
        task2: {
          blarg: false,
          bleek: { bork: 'bye!' },
        },
      }),
    ];

    pluginTaskResults = [
      createMockTaskResult(
        'mock-meta-task-6',
        'Mock Meta Task 6',
        Category.Insights,
        Priority.Low,
        {}
      ),
      createMockTaskResult(
        'mock-meta-task-7',
        'Mock Meta Task 7',
        Category.Migrations,
        Priority.High,
        {}
      ),
      createMockTaskResult(
        'mock-meta-task-3',
        'Mock Meta Task 3',
        Category.Insights,
        Priority.High,
        {}
      ),
      createMockTaskResult(
        'mock-meta-task-5',
        'Mock Meta Task 5',
        Category.Insights,
        Priority.High,
        {}
      ),
      createMockTaskResult(
        'mock-meta-task-8',
        'Mock Meta Task 8',
        Category.Migrations,
        Priority.Low,
        {}
      ),
      createMockTaskResult(
        'mock-meta-task-4',
        'Mock Meta Task 4',
        Category.Insights,
        Priority.Medium,
        {}
      ),
    ];

    let transformed = _transformResults(metaTaskResults, pluginTaskResults);

    expect(transformed).toMatchInlineSnapshot(`
      Object {
        "meta": Object {
          "task1": Object {
            "bar": "baz",
            "foo": true,
          },
          "task2": Object {
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
            "result": Object {},
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
            "result": Object {},
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
            "result": Object {},
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
            "result": Object {},
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
            "result": Object {},
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
            "result": Object {},
          },
        ],
      }
    `);
  });
});
