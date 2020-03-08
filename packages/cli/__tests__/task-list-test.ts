import { Category, Priority, Task, TaskClassification, TaskName, TaskResult } from '@checkup/core';

import MockTaskResult from './__utils__/mock-task-result';
import TaskList from '../src/task-list';

class MockTask implements Task {
  taskName: TaskName = 'mock-task';
  friendlyTaskName: TaskName = 'Mock Task';
  taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.High,
  };

  async run(): Promise<TaskResult> {
    return new MockTaskResult(this, 'mock task is being run');
  }
}

class AnotherMockTask implements Task {
  taskName: TaskName = 'another-mock-task';
  friendlyTaskName: TaskName = 'Another Mock Task';
  taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.Low,
  };

  async run(): Promise<TaskResult> {
    return new MockTaskResult(this, 'another mock task is being run');
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

    taskList.registerTask(new MockTask());

    expect(taskList.categories.get(Category.Core)!.size).toEqual(1);
  });

  it('runTask will run a task by taskName', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new MockTask());

    let result = await taskList.runTask('mock-task');

    expect(result.json()).toMatchSnapshot();
  });

  it('runTasks will run all registered tasks', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new MockTask());
    taskList.registerTask(new AnotherMockTask());

    let result = await taskList.runTasks();

    expect(result[0].json()).toMatchSnapshot();
    expect(result[1].json()).toMatchSnapshot();
  });
});
