import { InsightsTaskHigh } from './__utils__/mock-tasks';
import { TaskType } from '@checkup/core';
import TaskTypeMap from '../src/task-type-map';
import { getTaskContext } from '@checkup/test-helpers';

describe('TaskTypeMap', () => {
  it('can create an instance of a TaskTypeMap', () => {
    let map = new TaskTypeMap();

    expect(map).toBeInstanceOf(TaskTypeMap);
  });

  it('will return entries', () => {
    let map = new TaskTypeMap();

    map.setTaskByTaskType(
      TaskType.Insights,
      'insights-task-high',
      new InsightsTaskHigh(getTaskContext())
    );

    expect([...map.entries()]).toHaveLength(1);
  });

  it('will return values', () => {
    let map = new TaskTypeMap();

    map.setTaskByTaskType(
      TaskType.Insights,
      'insights-task-high',
      new InsightsTaskHigh(getTaskContext())
    );

    expect([...map.values()]).toHaveLength(1);
  });

  it('will return a task via getTask', () => {
    let map = new TaskTypeMap();

    map.setTaskByTaskType(
      TaskType.Insights,
      'insights-task-high',
      new InsightsTaskHigh(getTaskContext())
    );

    expect(map.getTask('insights-task-high')).toBeInstanceOf(InsightsTaskHigh);
  });

  it('will return a task via getTaskByCategory', () => {
    let map = new TaskTypeMap();

    map.setTaskByTaskType(
      TaskType.Insights,
      'insights-task-high',
      new InsightsTaskHigh(getTaskContext())
    );

    expect(map.getTaskByTaskType(TaskType.Insights, 'insights-task-high')).toBeInstanceOf(
      InsightsTaskHigh
    );
  });

  it('size will return the correct total size across maps', () => {
    let map = new TaskTypeMap();
    map.setTaskByTaskType(
      TaskType.Insights,
      'insights-task-high',
      new InsightsTaskHigh(getTaskContext())
    );
    map.setTaskByTaskType(
      TaskType.Migrations,
      'insights-task-high',
      new InsightsTaskHigh(getTaskContext())
    );
    map.setTaskByTaskType(
      TaskType.Recommendations,
      'insights-task-high',
      new InsightsTaskHigh(getTaskContext())
    );

    expect(map.size).toEqual(3);
  });
});
