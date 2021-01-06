import { MetaTask, MetaTaskResult } from '../src/types';

import MetaTaskList from '../src/meta-task-list';
import MockMetaTaskResult from './__utils__/mock-meta-task-result';

class FakeMetaTask implements MetaTask {
  meta = {
    taskName: 'fake-meta-task',
    taskDisplayName: 'Fake Meta Task',
  };

  async run(): Promise<MetaTaskResult> {
    return new MockMetaTaskResult(this.meta, 'fake meta task is being run');
  }
}

class OtherFakeMetaTask implements MetaTask {
  meta = {
    taskName: 'other-fake-meta-task',
    taskDisplayName: 'Other Fake Meta Task',
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

    let [result, errors] = await taskList.runTask('fake-meta-task');

    expect(result!).toMatchInlineSnapshot(`
      MockMetaTaskResult {
        "meta": Object {
          "taskDisplayName": "Fake Meta Task",
          "taskName": "fake-meta-task",
        },
        "result": "fake meta task is being run",
      }
    `);
    expect(errors).toHaveLength(0);
  });

  it('runTasks will run all registered tasks', async () => {
    let taskList = new MetaTaskList();

    taskList.registerTask(new FakeMetaTask());
    taskList.registerTask(new OtherFakeMetaTask());

    let [results, errors] = await taskList.runTasks();

    expect(results[0]).toMatchSnapshot();
    expect(results[1]).toMatchSnapshot();
    expect(errors).toHaveLength(0);
  });
});
