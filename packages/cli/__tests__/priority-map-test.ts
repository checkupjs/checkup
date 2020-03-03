import { BaseTask, Category, Priority, TaskClassification, TaskName } from '@checkup/core';

import PriorityMap from '../src/priority-map';

class MockTask extends BaseTask {
  taskName: TaskName = 'mock-task';
  friendlyTaskName: TaskName = 'Mock Task';
  taskClassification: TaskClassification = {
    category: Category.Core,
    priority: Priority.High,
  };

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

describe('PriorityMap', () => {
  it('can create an instance of a PriorityMap', () => {
    let map = new PriorityMap();

    expect(map).toBeInstanceOf(PriorityMap);
  });

  it('will return entries', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.High, 'mock-task', new MockTask({}));

    expect([...map.entries()]).toHaveLength(1);
  });

  it('will return values', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.High, 'mock-task', new MockTask({}));

    expect([...map.values()]).toHaveLength(1);
  });

  it('will return a task via getTask', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.Low, 'mock-task', new MockTask({}));

    expect(map.getTask('mock-task')).toBeInstanceOf(MockTask);
  });

  it('will return a task via getTaskByPriority', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.High, 'mock-task', new MockTask({}));

    expect(map.getTaskByPriority(Priority.High, 'mock-task')).toBeInstanceOf(MockTask);
  });

  it('size will return the correct total size across maps', () => {
    let map = new PriorityMap();
    map.setTaskByPriority(Priority.High, 'mock-task', new MockTask({}));
    map.setTaskByPriority(Priority.Medium, 'mock-task', new MockTask({}));
    map.setTaskByPriority(Priority.Low, 'mock-task', new MockTask({}));

    expect(map.size).toEqual(3);
  });
});
