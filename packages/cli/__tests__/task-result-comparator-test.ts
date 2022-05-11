import { taskResultComparator } from '../src/task-result-comparator';
import { getMockResult } from './__utils__/mock-task-result';

describe('taskResultComparator', () => {
  it('should sort task results by category with no group', () => {
    let results = [
      getMockResult('foo', 'linting'),
      getMockResult('fod', 'migrations'),
      getMockResult('bar', 'testing'),
      getMockResult('bag', 'best practices'),
      getMockResult('baz', 'metrics'),
      getMockResult('bad', 'dependencies'),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
[
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "metrics",
      "group": "",
      "taskDisplayName": "baz",
      "taskName": "baz",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "best practices",
      "group": "",
      "taskDisplayName": "bag",
      "taskName": "bag",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "dependencies",
      "group": "",
      "taskDisplayName": "bad",
      "taskName": "bad",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "linting",
      "group": "",
      "taskDisplayName": "foo",
      "taskName": "foo",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "testing",
      "group": "",
      "taskDisplayName": "bar",
      "taskName": "bar",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "migrations",
      "group": "",
      "taskDisplayName": "fod",
      "taskName": "fod",
    },
  },
]
`);
  });

  it('should sort task results with custom category by category with no group', () => {
    let results = [
      getMockResult('foo', 'linting'),
      getMockResult('fod', 'testing'),
      getMockResult('bar', 'custom category2'),
      getMockResult('bar', 'custom category'),
      getMockResult('bag', 'best practices'),
      getMockResult('baz', 'metrics'),
      getMockResult('bad', 'dependencies'),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
[
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "metrics",
      "group": "",
      "taskDisplayName": "baz",
      "taskName": "baz",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "best practices",
      "group": "",
      "taskDisplayName": "bag",
      "taskName": "bag",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "dependencies",
      "group": "",
      "taskDisplayName": "bad",
      "taskName": "bad",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "linting",
      "group": "",
      "taskDisplayName": "foo",
      "taskName": "foo",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "testing",
      "group": "",
      "taskDisplayName": "fod",
      "taskName": "fod",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "custom category2",
      "group": "",
      "taskDisplayName": "bar",
      "taskName": "bar",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "custom category",
      "group": "",
      "taskDisplayName": "bar",
      "taskName": "bar",
    },
  },
]
`);
  });

  it('should sort task results by category with group', () => {
    let results = [
      getMockResult('foo', 'linting'),
      getMockResult('fod', 'best practices', 'lint'),
      getMockResult('bar', 'best practices'),
      getMockResult('baz', 'metrics'),
      getMockResult('bag', 'dependencies'),
      getMockResult('bad', 'best practices', 'lint'),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
[
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "metrics",
      "group": "",
      "taskDisplayName": "baz",
      "taskName": "baz",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "best practices",
      "group": "lint",
      "taskDisplayName": "fod",
      "taskName": "fod",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "best practices",
      "group": "lint",
      "taskDisplayName": "bad",
      "taskName": "bad",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "best practices",
      "group": "",
      "taskDisplayName": "bar",
      "taskName": "bar",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "dependencies",
      "group": "",
      "taskDisplayName": "bag",
      "taskName": "bag",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "linting",
      "group": "",
      "taskDisplayName": "foo",
      "taskName": "foo",
    },
  },
]
`);
  });

  it('should sort task results with custom category by category with group', () => {
    let results = [
      getMockResult('foo', 'linting'),
      getMockResult('fod', 'grouped linting', 'lint'),
      getMockResult('bar', 'best practices'),
      getMockResult('baz', 'metrics'),
      getMockResult('bad', 'dependencies'),
      getMockResult('bag', 'grouped linting2', 'lint'),
    ];

    expect(results.sort(taskResultComparator)).toMatchInlineSnapshot(`
[
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "metrics",
      "group": "",
      "taskDisplayName": "baz",
      "taskName": "baz",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "best practices",
      "group": "",
      "taskDisplayName": "bar",
      "taskName": "bar",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "dependencies",
      "group": "",
      "taskDisplayName": "bad",
      "taskName": "bad",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "linting",
      "group": "",
      "taskDisplayName": "foo",
      "taskName": "foo",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "grouped linting",
      "group": "lint",
      "taskDisplayName": "fod",
      "taskName": "fod",
    },
  },
  {
    "message": {
      "text": "hey",
    },
    "properties": {
      "category": "grouped linting2",
      "group": "lint",
      "taskDisplayName": "bag",
      "taskName": "bag",
    },
  },
]
`);
  });
});
