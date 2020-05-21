import { Category, Priority, TaskContext } from '../src/types/tasks';
import { getTaskContext } from '@checkup/test-helpers';

import BaseTask from '../src/base-task';

class FakeTask extends BaseTask {
  meta = {
    taskName: 'my-fake',
    friendlyTaskName: 'Fake',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.High,
    },
  };
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
          'fake/my-fake': ['on', { 'my-fake-option': true }],
        },
      },
    });

    let fakeTask = new FakeTask('fake', context);

    expect(fakeTask.enabled).toEqual(true);
    expect(fakeTask.config).toEqual({ 'my-fake-option': true });
  });
});
