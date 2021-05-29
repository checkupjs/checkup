import { getTaskContext } from '@checkup/test-helpers';

import BaseTask from '../src/base-task';
import { TaskContext } from '../src/types/tasks';

class FakeTask extends BaseTask {
  taskName = 'my-fake';
  taskDisplayName = 'Fake';
  description = 'description';
  category = 'foo';
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

  it('can add a result to the SARIF log', () => {
    let context: TaskContext = getTaskContext();

    let fakeTask = new FakeTask('fake', context);

    fakeTask.addResult('The is a fake message', 'informational', 'note');

    let run = fakeTask.context.logBuilder.currentRunBuilder.run;

    expect(run.tool.driver.rules).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "my-fake",
        },
      ]
    `);
    expect(run.results).toMatchInlineSnapshot(`
      Array [
        Object {
          "kind": "informational",
          "level": "note",
          "message": Object {
            "text": "The is a fake message",
          },
          "properties": Object {
            "category": "foo",
            "taskDisplayName": "Fake",
          },
          "ruleId": "my-fake",
          "ruleIndex": 0,
        },
      ]
    `);
    for (let result of run.results) {
      expect(result).toBeValidSarifFor('result');
    }
  });
});
