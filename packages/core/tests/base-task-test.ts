import '@microsoft/jest-sarif';
import { getTaskContext } from '@checkup/test-helpers';
import BaseTask from '../src/base-task';
import { TaskContext } from '../src/types/tasks';

class FakeTask extends BaseTask {
  taskName = 'my-fake';
  taskDisplayName = 'Fake';
  description = 'description';
  category = 'foo';

  constructor(pluginName: string, context: TaskContext) {
    super(pluginName, context);

    this.addRule();
  }
}

describe('BaseTask', () => {
  it('creates a task with correct defaults set', () => {
    let context: TaskContext = getTaskContext();

    let fakeTask = new FakeTask('fake', context);

    expect(fakeTask.context).toEqual(context);
    expect(fakeTask.config).toEqual({});
    expect(fakeTask.enabled).toEqual(true);
  });

  it('creates a disabled task if config is set to "off"', () => {
    let context: TaskContext = getTaskContext({
      config: {
        plugins: [],
        tasks: {
          'fake/my-fake': 'off',
        },
      },
    });

    let fakeTask = new FakeTask('fake', context);

    expect(fakeTask.enabled).toEqual(false);
  });

  it('creates a task with custom config values', () => {
    let context: TaskContext = getTaskContext({
      config: {
        plugins: [],
        tasks: {
          'fake/my-fake': ['on', { 'my-fake-option': 20 }],
        },
      },
    });

    let fakeTask = new FakeTask('fake', context);

    expect(fakeTask.enabled).toEqual(true);
    expect(fakeTask.config).toEqual({ 'my-fake-option': 20 });
  });

  describe('addResult', () => {
    it('can add a result', () => {
      let context: TaskContext = getTaskContext();

      let fakeTask = new FakeTask('fake', context);

      fakeTask.addResult('The is a fake message', 'informational', 'note');

      let run = fakeTask.context.logBuilder.currentRunBuilder.run;

      expect(run.tool.driver.rules).toMatchInlineSnapshot(`
        [
          {
            "id": "fake/my-fake",
            "properties": {
              "category": "foo",
              "taskDisplayName": "Fake",
            },
            "shortDescription": {
              "text": "description",
            },
          },
        ]
      `);
      expect(run.results).toMatchInlineSnapshot(`
        [
          {
            "kind": "informational",
            "level": "note",
            "message": {
              "text": "The is a fake message",
            },
            "ruleId": "fake/my-fake",
            "ruleIndex": 0,
          },
        ]
      `);
      for (let result of run.results) {
        expect(result).toBeValidSarifFor('result');
      }
    });

    it('can add a result with location.uri', () => {
      let context: TaskContext = getTaskContext();

      let fakeTask = new FakeTask('fake', context);

      fakeTask.addResult('The is a fake message', 'informational', 'note', {
        location: { uri: 'path/to/file.js' },
      });

      let run = fakeTask.context.logBuilder.currentRunBuilder.run;

      expect(run.tool.driver.rules).toMatchInlineSnapshot(`
        [
          {
            "id": "fake/my-fake",
            "properties": {
              "category": "foo",
              "taskDisplayName": "Fake",
            },
            "shortDescription": {
              "text": "description",
            },
          },
        ]
      `);
      expect(run.results).toMatchInlineSnapshot(`
        [
          {
            "kind": "informational",
            "level": "note",
            "locations": [
              {
                "physicalLocation": {
                  "artifactLocation": {
                    "uri": "path/to/file.js",
                  },
                },
              },
            ],
            "message": {
              "text": "The is a fake message",
            },
            "ruleId": "fake/my-fake",
            "ruleIndex": 0,
          },
        ]
      `);
      for (let result of run.results) {
        expect(result).toBeValidSarifFor('result');
      }
    });

    it('can add a result with location', () => {
      let context: TaskContext = getTaskContext();

      let fakeTask = new FakeTask('fake', context);

      fakeTask.addResult('The is a fake message', 'informational', 'note', {
        location: { uri: 'path/to/file.js', startLine: 1, startColumn: 1 },
      });

      let run = fakeTask.context.logBuilder.currentRunBuilder.run;

      expect(run.tool.driver.rules).toMatchInlineSnapshot(`
        [
          {
            "id": "fake/my-fake",
            "properties": {
              "category": "foo",
              "taskDisplayName": "Fake",
            },
            "shortDescription": {
              "text": "description",
            },
          },
        ]
      `);
      expect(run.results).toMatchInlineSnapshot(`
        [
          {
            "kind": "informational",
            "level": "note",
            "locations": [
              {
                "physicalLocation": {
                  "artifactLocation": {
                    "uri": "path/to/file.js",
                  },
                  "region": {
                    "endColumn": 1,
                    "endLine": 1,
                    "startColumn": 1,
                    "startLine": 1,
                  },
                },
              },
            ],
            "message": {
              "text": "The is a fake message",
            },
            "ruleId": "fake/my-fake",
            "ruleIndex": 0,
          },
        ]
      `);
      for (let result of run.results) {
        expect(result).toBeValidSarifFor('result');
      }
    });
  });

  it('can add a result to the SARIF log', () => {
    let context: TaskContext = getTaskContext();

    let fakeTask = new FakeTask('fake', context);

    fakeTask.addResult('The is a fake message', 'informational', 'note');

    let run = fakeTask.context.logBuilder.currentRunBuilder.run;

    expect(run.tool.driver.rules).toMatchInlineSnapshot(`
      [
        {
          "id": "fake/my-fake",
          "properties": {
            "category": "foo",
            "taskDisplayName": "Fake",
          },
          "shortDescription": {
            "text": "description",
          },
        },
      ]
    `);
    expect(run.results).toMatchInlineSnapshot(`
      [
        {
          "kind": "informational",
          "level": "note",
          "message": {
            "text": "The is a fake message",
          },
          "ruleId": "fake/my-fake",
          "ruleIndex": 0,
        },
      ]
    `);
    for (let result of run.results) {
      expect(result).toBeValidSarifFor('result');
    }
  });
});
