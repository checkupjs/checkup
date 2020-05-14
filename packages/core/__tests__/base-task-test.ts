import { Category, Priority, TaskContext } from '../src/types/tasks';

import BaseTask from '../src/base-task';
import { getRegisteredParsers } from '../src/parsers/registered-parsers';

const DEFAULT_FLAGS = {
  version: undefined,
  help: undefined,
  force: false,
  silent: false,
  reporter: 'stdout',
  reportOutputPath: '.',
  cwd: '.',
  task: undefined,
  config: undefined,
};

const DEFAULT_CONFIG = {
  plugins: [],
  tasks: {},
};

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
    let context: TaskContext = {
      cliArguments: {},
      cliFlags: DEFAULT_FLAGS,
      parsers: getRegisteredParsers(),
      config: DEFAULT_CONFIG,
    };

    let fakeTask = new FakeTask('fake', context);

    expect(fakeTask.context).toEqual(context);
    expect(fakeTask.config).toEqual({});
    expect(fakeTask.enabled).toEqual(true);
  });

  it('creates a disabled task if config is set to "off"', () => {
    let context: TaskContext = {
      cliArguments: {},
      cliFlags: DEFAULT_FLAGS,
      parsers: getRegisteredParsers(),
      config: {
        plugins: [],
        tasks: {
          'fake/my-fake': 'off',
        },
      },
    };

    let fakeTask = new FakeTask('fake', context);

    expect(fakeTask.enabled).toEqual(false);
  });

  it('creates a task with custom config values', () => {
    let context: TaskContext = {
      cliArguments: {},
      cliFlags: DEFAULT_FLAGS,
      parsers: getRegisteredParsers(),
      config: {
        plugins: [],
        tasks: {
          'fake/my-fake': ['on', { 'my-fake-option': true }],
        },
      },
    };

    let fakeTask = new FakeTask('fake', context);

    expect(fakeTask.enabled).toEqual(true);
    expect(fakeTask.config).toEqual({ 'my-fake-option': true });
  });
});
