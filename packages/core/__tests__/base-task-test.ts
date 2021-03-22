import { getTaskContext } from '@checkup/test-helpers';

import BaseTask from '../src/base-task';
import { TaskContext2 } from '../src/types/tasks';

class FakeTask extends BaseTask {
  taskName = 'my-fake';
  taskDisplayName = 'Fake';
  category = 'foo';
}

describe('BaseTask', () => {
  it('creates a task with correct defaults set', () => {
    let context: TaskContext2 = getTaskContext();

    let fakeTask = new FakeTask('fake', context);

    expect(fakeTask.context).toEqual(context);
    expect(fakeTask.config).toEqual({});
    expect(fakeTask.enabled).toEqual(true);
  });

  it('creates a disabled task if config is set to "off"', () => {
    let context: TaskContext2 = getTaskContext({
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
    let context: TaskContext2 = getTaskContext({
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
});
