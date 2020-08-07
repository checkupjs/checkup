import { taskResultComparator } from '../src/task-result-comparator';
import { getMockTaskResult } from './__utils__/mock-task-result';

describe('taskResultComparator', () => {
  it('should sort task results by category with no group', () => {
    let results = [
      getMockTaskResult('foo', 'linting'),
      getMockTaskResult('fod', 'migrations'),
      getMockTaskResult('bar', 'testing'),
      getMockTaskResult('bag', 'best practices'),
      getMockTaskResult('baz', 'metrics'),
      getMockTaskResult('bad', 'dependencies'),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        Object {
          "info": Object {
            "category": "metrics",
            "group": "",
            "taskDisplayName": "baz",
            "taskName": "baz",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "best practices",
            "group": "",
            "taskDisplayName": "bag",
            "taskName": "bag",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "dependencies",
            "group": "",
            "taskDisplayName": "bad",
            "taskName": "bad",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "linting",
            "group": "",
            "taskDisplayName": "foo",
            "taskName": "foo",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "testing",
            "group": "",
            "taskDisplayName": "bar",
            "taskName": "bar",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "migrations",
            "group": "",
            "taskDisplayName": "fod",
            "taskName": "fod",
          },
          "result": Object {},
        },
      ]
    `);
  });

  it('should sort task results with custom category by category with no group', () => {
    let results = [
      getMockTaskResult('foo', 'linting'),
      getMockTaskResult('fod', 'testing'),
      getMockTaskResult('bar', 'custom category2'),
      getMockTaskResult('bar', 'custom category'),
      getMockTaskResult('bag', 'best practices'),
      getMockTaskResult('baz', 'metrics'),
      getMockTaskResult('bad', 'dependencies'),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        Object {
          "info": Object {
            "category": "metrics",
            "group": "",
            "taskDisplayName": "baz",
            "taskName": "baz",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "best practices",
            "group": "",
            "taskDisplayName": "bag",
            "taskName": "bag",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "dependencies",
            "group": "",
            "taskDisplayName": "bad",
            "taskName": "bad",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "linting",
            "group": "",
            "taskDisplayName": "foo",
            "taskName": "foo",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "testing",
            "group": "",
            "taskDisplayName": "fod",
            "taskName": "fod",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "custom category2",
            "group": "",
            "taskDisplayName": "bar",
            "taskName": "bar",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "custom category",
            "group": "",
            "taskDisplayName": "bar",
            "taskName": "bar",
          },
          "result": Object {},
        },
      ]
    `);
  });

  it('should sort task results by category with group', () => {
    let results = [
      getMockTaskResult('foo', 'linting'),
      getMockTaskResult('fod', 'best practices', 'lint'),
      getMockTaskResult('bar', 'best practices'),
      getMockTaskResult('baz', 'metrics'),
      getMockTaskResult('bag', 'dependencies'),
      getMockTaskResult('bad', 'best practices', 'lint'),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        Object {
          "info": Object {
            "category": "metrics",
            "group": "",
            "taskDisplayName": "baz",
            "taskName": "baz",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "best practices",
            "group": "lint",
            "taskDisplayName": "fod",
            "taskName": "fod",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "best practices",
            "group": "lint",
            "taskDisplayName": "bad",
            "taskName": "bad",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "best practices",
            "group": "",
            "taskDisplayName": "bar",
            "taskName": "bar",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "dependencies",
            "group": "",
            "taskDisplayName": "bag",
            "taskName": "bag",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "linting",
            "group": "",
            "taskDisplayName": "foo",
            "taskName": "foo",
          },
          "result": Object {},
        },
      ]
    `);
  });

  it('should sort task results with custom category by category with group', () => {
    let results = [
      getMockTaskResult('foo', 'linting'),
      getMockTaskResult('fod', 'grouped linting', 'lint'),
      getMockTaskResult('bar', 'best practices'),
      getMockTaskResult('baz', 'metrics'),
      getMockTaskResult('bad', 'dependencies'),
      getMockTaskResult('bag', 'grouped linting2', 'lint'),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
      Array [
        Object {
          "info": Object {
            "category": "metrics",
            "group": "",
            "taskDisplayName": "baz",
            "taskName": "baz",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "best practices",
            "group": "",
            "taskDisplayName": "bar",
            "taskName": "bar",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "dependencies",
            "group": "",
            "taskDisplayName": "bad",
            "taskName": "bad",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "linting",
            "group": "",
            "taskDisplayName": "foo",
            "taskName": "foo",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "grouped linting",
            "group": "lint",
            "taskDisplayName": "fod",
            "taskName": "fod",
          },
          "result": Object {},
        },
        Object {
          "info": Object {
            "category": "grouped linting2",
            "group": "lint",
            "taskDisplayName": "bag",
            "taskName": "bag",
          },
          "result": Object {},
        },
      ]
    `);
  });
});
