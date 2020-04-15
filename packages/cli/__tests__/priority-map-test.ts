import MockTask from './__utils__/mock-task';
import { Priority } from '@checkup/core';
import PriorityMap from '../src/priority-map';

describe('PriorityMap', () => {
  it('can create an instance of a PriorityMap', () => {
    let map = new PriorityMap();

    expect(map).toBeInstanceOf(PriorityMap);
  });

  it('will return entries', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.High, 'mock-task', new MockTask());

    expect([...map.entries()]).toHaveLength(1);
  });

  it('will return values', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.High, 'mock-task', new MockTask());

    expect([...map.values()]).toHaveLength(1);
  });

  it('will return a task via getTask', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.Low, 'mock-task', new MockTask());

    expect(map.getTask('mock-task')).toBeInstanceOf(MockTask);
  });

  it('will return a task via getTaskByPriority', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.High, 'mock-task', new MockTask());

    expect(map.getTaskByPriority(Priority.High, 'mock-task')).toBeInstanceOf(MockTask);
  });

  it('size will return the correct total size across maps', () => {
    let map = new PriorityMap();
    map.setTaskByPriority(Priority.High, 'mock-task', new MockTask());
    map.setTaskByPriority(Priority.Medium, 'mock-task', new MockTask());
    map.setTaskByPriority(Priority.Low, 'mock-task', new MockTask());

    expect(map.size).toEqual(3);
  });
});
