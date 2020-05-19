import { Category, OutputFormat, Priority, TaskResult } from '@checkup/core';
import {
  DEFAULT_OUTPUT_FILENAME,
  _transformHTMLResults,
  _transformJsonResults,
  getOutputPath,
} from '../src/reporters';

import { MetaTaskResult } from '../src/types';
import MockMetaTaskResult from './__utils__/mock-meta-task-result';
import MockPieChartTaskResult from './__utils__/mock-pie-chart-task-result';
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

describe('_transformHTMLResults', () => {
  it('transforms meta and plugin results into correct format when chart is not required', () => {
    let transformed = _transformHTMLResults(metaTaskResults, pluginTaskResults);

    expect(transformed).toMatchSnapshot();
  });
  it('transforms meta and plugin results into correct format when chart IS required', () => {
    let transformed = _transformHTMLResults(metaTaskResults, [
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

describe('getOutputPath', () => {
  it('throws if output format is stdout', () => {
    expect(() => {
      getOutputPath(OutputFormat.stdout, '');
    }).toThrow('The `stdout` format cannot be used to generate an output file path');
  });

  [OutputFormat.json, OutputFormat.html].forEach((format) => {
    it(`returns same path when absolute path provided for ${format}`, () => {
      expect(getOutputPath(format, `/some-file.${format}`)).toEqual(`/some-file.${format}`);
    });

    it(`returns resolved path when path provided for ${format}`, () => {
      expect(getOutputPath(format, `some-file.${format}`, __dirname)).toEqual(
        join(__dirname, `some-file.${format}`)
      );
    });

    it(`returns default file format if no outputFile provided for ${format}`, () => {
      expect(getOutputPath(format, '', __dirname)).toEqual(
        join(__dirname, `${DEFAULT_OUTPUT_FILENAME}.${format}`)
      );
    });

    it(`returns default output path format if {default} token provided for ${format}`, () => {
      expect(getOutputPath(format, `{default}.${format}`, __dirname)).toEqual(
        join(__dirname, `${DEFAULT_OUTPUT_FILENAME}.${format}`)
      );
    });
  });
});
