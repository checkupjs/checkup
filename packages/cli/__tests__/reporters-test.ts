import { DEFAULT_OUTPUT_FILENAME, _transformJsonResults, getOutputPath } from '../src/reporters';
import { TaskResult } from '@checkup/core';

import { MetaTaskResult } from '../src/types';
import MockMetaTaskResult from './__utils__/mock-meta-task-result';
import { getMockTaskResult } from './__utils__/mock-task-result';
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
  getMockTaskResult(
    {
      taskName: 'mock-meta-task-6',
      friendlyTaskName: 'Mock Meta Task 6',
      taskClassification: {
        category: 'foo',
      },
    },
    [],
    {
      foo: true,
      bar: 'baz',
    }
  ),
  getMockTaskResult(
    {
      taskName: 'mock-meta-task-7',
      friendlyTaskName: 'Mock Meta Task 7',
      taskClassification: {
        category: 'foo',
      },
    },
    [],
    {
      foo: true,
      bar: 'baz',
    }
  ),
  getMockTaskResult(
    {
      taskName: 'mock-meta-task-3',
      friendlyTaskName: 'Mock Meta Task 3',
      taskClassification: {
        category: 'foo',
      },
    },
    [],
    {
      foo: true,
      bar: 'baz',
    }
  ),
  getMockTaskResult(
    {
      taskName: 'mock-meta-task-5',
      friendlyTaskName: 'Mock Meta Task 5',
      taskClassification: {
        category: 'bar',
      },
    },
    [],
    {
      foo: true,
      bar: 'baz',
    }
  ),
  getMockTaskResult(
    {
      taskName: 'mock-meta-task-8',
      friendlyTaskName: 'Mock Meta Task 8',
      taskClassification: {
        category: 'bar',
      },
    },
    [],
    {
      foo: true,
      bar: 'baz',
    }
  ),
  getMockTaskResult(
    {
      taskName: 'mock-meta-task-4',
      friendlyTaskName: 'Mock Meta Task 4',
      taskClassification: {
        category: 'bar',
      },
    },
    [],
    {
      foo: true,
      bar: 'baz',
    }
  ),
];

describe('_transformJsonResults', () => {
  it('transforms meta and plugin results into correct format', () => {
    let transformed = _transformJsonResults(
      metaTaskResults,
      pluginTaskResults,
      [{ error: 'Something is broken...', taskName: 'mock-meta-task-6' }],
      [
        {
          defaultThreshold: 20,
          details: '1 total errors',
          input: 1,
          items: ['Total eslint errors: 1'],
          name: 'reduce-eslint-errors',
          summary: 'Reduce number of eslint errors',
        },
      ]
    );

    expect(transformed).toMatchInlineSnapshot(`
      Object {
        "actions": Array [
          Object {
            "defaultThreshold": 20,
            "details": "1 total errors",
            "input": 1,
            "items": Array [
              "Total eslint errors: 1",
            ],
            "name": "reduce-eslint-errors",
            "summary": "Reduce number of eslint errors",
          },
        ],
        "errors": Array [
          Object {
            "error": "Something is broken...",
            "taskName": "mock-meta-task-6",
          },
        ],
        "info": Object {
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
            "info": Object {
              "friendlyTaskName": "Mock Meta Task 6",
              "taskClassification": Object {
                "category": "foo",
              },
              "taskName": "mock-meta-task-6",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
          Object {
            "info": Object {
              "friendlyTaskName": "Mock Meta Task 7",
              "taskClassification": Object {
                "category": "foo",
              },
              "taskName": "mock-meta-task-7",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
          Object {
            "info": Object {
              "friendlyTaskName": "Mock Meta Task 3",
              "taskClassification": Object {
                "category": "foo",
              },
              "taskName": "mock-meta-task-3",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
          Object {
            "info": Object {
              "friendlyTaskName": "Mock Meta Task 5",
              "taskClassification": Object {
                "category": "bar",
              },
              "taskName": "mock-meta-task-5",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
          Object {
            "info": Object {
              "friendlyTaskName": "Mock Meta Task 8",
              "taskClassification": Object {
                "category": "bar",
              },
              "taskName": "mock-meta-task-8",
            },
            "result": Object {
              "bar": "baz",
              "foo": true,
            },
          },
          Object {
            "info": Object {
              "friendlyTaskName": "Mock Meta Task 4",
              "taskClassification": Object {
                "category": "bar",
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
