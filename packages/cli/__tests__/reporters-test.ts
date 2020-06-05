import { TaskType, TaskResult } from '@checkup/core';
import { DEFAULT_OUTPUT_FILENAME, _transformJsonResults, getOutputPath } from '../src/reporters';

import { MetaTaskResult } from '../src/types';
import MockMetaTaskResult from './__utils__/mock-meta-task-result';
import MockTaskResult from './__utils__/mock-task-result';
import { join } from 'path';

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
        taskType: TaskType.Insights,
        category: 'foo',
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
        taskType: TaskType.Migrations,
        category: 'foo',
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
        taskType: TaskType.Insights,
        category: 'foo',
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
        taskType: TaskType.Insights,
        category: 'bar',
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
        taskType: TaskType.Migrations,
        category: 'bar',
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
        taskType: TaskType.Insights,
        category: 'bar',
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
    let transformed = _transformJsonResults(metaTaskResults, pluginTaskResults, []);

    expect(transformed).toMatchInlineSnapshot(`
      Object {
        "errors": Array [],
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
                "category": "foo",
                "taskType": "insights",
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
                "category": "foo",
                "taskType": "migrations",
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
                "category": "foo",
                "taskType": "insights",
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
                "category": "bar",
                "taskType": "insights",
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
                "category": "bar",
                "taskType": "migrations",
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
                "category": "bar",
                "taskType": "insights",
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

describe('getOutputPath', () => {
  it(`returns same path when absolute path provided `, () => {
    expect(getOutputPath('/some-file.json')).toEqual('/some-file.json');
  });

  it(`returns resolved path when path provided `, () => {
    expect(getOutputPath('some-file.json', __dirname)).toEqual(join(__dirname, 'some-file.json'));
  });

  it(`returns default file format if no outputFile provided `, () => {
    expect(getOutputPath('', __dirname)).toEqual(
      join(__dirname, `${DEFAULT_OUTPUT_FILENAME}.json`)
    );
  });

  it(`returns default output path format if {default} token provided `, () => {
    expect(getOutputPath(`{default}.json`, __dirname)).toEqual(
      join(__dirname, `${DEFAULT_OUTPUT_FILENAME}.json`)
    );
  });
});
