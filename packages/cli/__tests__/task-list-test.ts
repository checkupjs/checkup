import { BaseTask, Category, Priority } from '@checkup/core';

import TaskList from '../src/task-list';

class MockTask extends BaseTask {
  run() {
    return Promise.resolve({
      toJson() {
        return {
          mockTask: 'You mock me',
        };
      },
      toConsole() {
        process.stdout.write('mock task is being run\n');
      },
    });
  }
}

class AnotherMockTask extends BaseTask {
  run() {
    return Promise.resolve({
      toJson() {
        return {
          anotherMockTask: 'You mock me, yet again',
        };
      },
      toConsole() {
        process.stdout.write('another mock task is being run\n');
      },
    });
  }
}

describe('TaskList', () => {
  it('can create an instance of a TaskList', () => {
    let taskList = new TaskList();

    expect(taskList).toBeInstanceOf(TaskList);
    expect(taskList.categories.size).toEqual(3);
  });

  it('registerTask adds a task to the TaskList', () => {
    let taskList = new TaskList();

    taskList.registerTask('mock-task', new MockTask({}), {
      category: Category.Core,
      priority: Priority.High,
    });

    expect(taskList.categories.get(Category.Core)!.size).toEqual(1);
  });

  it('runTask will run a task by taskName', async () => {
    let taskList = new TaskList();

    taskList.registerTask('mock-task', new MockTask({}), {
      category: Category.Core,
      priority: Priority.High,
    });

    let result = await taskList.runTask('mock-task');

    expect(result.toJson()).toStrictEqual({
      mockTask: 'You mock me',
    });
  });

  it('runTasks will run all registered tasks', async () => {
    let taskList = new TaskList();

    taskList.registerTask('mock-task', new MockTask({}), {
      category: Category.Core,
      priority: Priority.High,
    });
    taskList.registerTask('another-mock-task', new AnotherMockTask({}), {
      category: Category.Core,
      priority: Priority.High,
    });

    let result = await taskList.runTasks();

    expect(result[0].toJson()).toStrictEqual({
      mockTask: 'You mock me',
    });
    expect(result[1].toJson()).toStrictEqual({
      anotherMockTask: 'You mock me, yet again',
    });
  });
});
