import { MetaTask, MetaTaskResult } from '../src/types';

import MetaTaskList from '../src/meta-task-list';
import MockMetaTaskResult from './__utils__/mock-meta-task-result';

class FakeMetaTask implements MetaTask {
  meta = {
    taskName: 'fake-meta-task',
    friendlyTaskName: 'Fake Meta Task',
  };

  async run(): Promise<MetaTaskResult> {
    return new MockMetaTaskResult(this.meta, 'fake meta task is being run');
  }
}

class OtherFakeMetaTask implements MetaTask {
  meta = {
    taskName: 'other-fake-meta-task',
    friendlyTaskName: 'Other Fake Meta Task',
  };

  async run(): Promise<MetaTaskResult> {
    return new MockMetaTaskResult(this.meta, 'other fake meta task is being run');
  }
}

describe('MetaTaskList', () => {
  it('can create an instance of a MetaTaskList', () => {
    let taskList = new MetaTaskList();

    expect(taskList).toBeInstanceOf(MetaTaskList);
  });

  it('hasTask returns false if no task exists with that name', () => {
    let taskList = new MetaTaskList();

    taskList.registerTask(new FakeMetaTask());

    expect(taskList.hasTask('foo')).toEqual(false);
  });

  it('hasTask returns true if task exists with that name', () => {
    let taskList = new MetaTaskList();

    taskList.registerTask(new FakeMetaTask());

    expect(taskList.hasTask('fake-meta-task')).toEqual(true);
  });

  it('findTask returns undefined if no task exists with that name', () => {
    let taskList = new MetaTaskList();

    taskList.registerTask(new FakeMetaTask());

    expect(taskList.findTask('foo')).toBeUndefined();
  });

  it('findTask returns task instance if task exists with that name', () => {
    let taskList = new MetaTaskList();

    taskList.registerTask(new FakeMetaTask());

    expect(taskList.findTask('fake-meta-task')).toBeDefined();
  });

  it('runTask will run a task by taskName', async () => {
    let taskList = new MetaTaskList();

    taskList.registerTask(new FakeMetaTask());

    let result = await taskList.runTask('fake-meta-task');

    expect(result.json()).toMatchInlineSnapshot(`
      Object {
        "fake-meta-task": "fake meta task is being run",
      }
    `);
  });

  it('runTasks will run all registered tasks', async () => {
    let taskList = new MetaTaskList();

    taskList.registerTask(new FakeMetaTask());
    taskList.registerTask(new OtherFakeMetaTask());

    let result = await taskList.runTasks();

    expect(result[0].json()).toMatchSnapshot();
    expect(result[1].json()).toMatchSnapshot();
  });
});
