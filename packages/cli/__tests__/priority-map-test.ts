import { InsightsTaskHigh } from './__utils__/mock-tasks';
import { Priority } from '@checkup/core';
import PriorityMap from '../src/priority-map';

describe('PriorityMap', () => {
  it('can create an instance of a PriorityMap', () => {
    let map = new PriorityMap();

    expect(map).toBeInstanceOf(PriorityMap);
  });

  it('will return entries', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.High, 'insights-task-high', new InsightsTaskHigh());

    expect([...map.entries()]).toHaveLength(1);
  });

  it('will return values', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.High, 'insights-task-high', new InsightsTaskHigh());

    expect([...map.values()]).toHaveLength(1);
  });

  it('will return a task via getTask', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.Low, 'insights-task-high', new InsightsTaskHigh());

    expect(map.getTask('insights-task-high')).toBeInstanceOf(InsightsTaskHigh);
  });

  it('will return a task via getTaskByPriority', () => {
    let map = new PriorityMap();

    map.setTaskByPriority(Priority.High, 'insights-task-high', new InsightsTaskHigh());

    expect(map.getTaskByPriority(Priority.High, 'insights-task-high')).toBeInstanceOf(
      InsightsTaskHigh
    );
  });

  it('size will return the correct total size across maps', () => {
    let map = new PriorityMap();
    map.setTaskByPriority(Priority.High, 'insights-task-high', new InsightsTaskHigh());
    map.setTaskByPriority(Priority.Medium, 'insights-task-high', new InsightsTaskHigh());
    map.setTaskByPriority(Priority.Low, 'insights-task-high', new InsightsTaskHigh());

    expect(map.size).toEqual(3);
  });
});
