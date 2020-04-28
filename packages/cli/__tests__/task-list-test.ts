import {
  InsightsTaskHigh,
  InsightsTaskLow,
  MigrationTaskHigh,
  MigrationTaskLow,
  RecommendationsTaskHigh,
  RecommendationsTaskLow,
} from './__utils__/mock-tasks';

import { Category } from '@checkup/core';
import TaskList from '../src/task-list';

describe('TaskList', () => {
  it('can create an instance of a TaskList', () => {
    let taskList = new TaskList();

    expect(taskList).toBeInstanceOf(TaskList);
    expect(taskList.categories.size).toEqual(0);
  });

  it('registerTask adds a task to the TaskList', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh());

    expect(taskList.categories.get(Category.Insights)!.size).toEqual(1);
  });

  it('hasTask returns false if no task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh());

    expect(taskList.hasTask('foo')).toEqual(false);
  });

  it('hasTask returns true if task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh());

    expect(taskList.hasTask('insights-task-high')).toEqual(true);
  });

  it('findTask returns undefined if no task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh());

    expect(taskList.findTask('foo')).toBeUndefined();
  });

  it('findTask returns task instance if task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh());

    expect(taskList.findTask('insights-task-high')).toBeDefined();
  });

  it('runTask will run a task by taskName', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh());

    let result = await taskList.runTask('insights-task-high');

    expect(result.toJson()).toMatchSnapshot();
  });

  it('runTasks will run all registered tasks', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh());
    taskList.registerTask(new InsightsTaskLow());

    let result = await taskList.runTasks();

    expect(result[0].toJson()).toMatchSnapshot();
    expect(result[1].toJson()).toMatchSnapshot();
  });

  it('runTasks will sort tasks in the correct order', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskLow());
    taskList.registerTask(new RecommendationsTaskHigh());
    taskList.registerTask(new MigrationTaskLow());
    taskList.registerTask(new MigrationTaskHigh());
    taskList.registerTask(new RecommendationsTaskLow());
    taskList.registerTask(new InsightsTaskHigh());

    let result = await taskList.runTasks();

    expect(result).toMatchInlineSnapshot(`
      Array [
        MockTaskResult {
          "meta": Object {
            "friendlyTaskName": "Insights Task High",
            "taskClassification": Object {
              "category": "insights",
              "priority": "high",
            },
            "taskName": "insights-task-high",
          },
          "result": "insights task high is being run",
        },
        MockTaskResult {
          "meta": Object {
            "friendlyTaskName": "Insights Task Low",
            "taskClassification": Object {
              "category": "insights",
              "priority": "low",
            },
            "taskName": "insights-task-low",
          },
          "result": "insights task low is being run",
        },
        MockTaskResult {
          "meta": Object {
            "friendlyTaskName": "Migration Task High",
            "taskClassification": Object {
              "category": "migrations",
              "priority": "high",
            },
            "taskName": "migration-task-high",
          },
          "result": "migration task high is being run",
        },
        MockTaskResult {
          "meta": Object {
            "friendlyTaskName": "Migration Task Low",
            "taskClassification": Object {
              "category": "migrations",
              "priority": "low",
            },
            "taskName": "migration-task-low",
          },
          "result": "migration task low is being run",
        },
        MockTaskResult {
          "meta": Object {
            "friendlyTaskName": "Recommendations Task High",
            "taskClassification": Object {
              "category": "recommendations",
              "priority": "high",
            },
            "taskName": "recommendations-task-high",
          },
          "result": "recommendations task high is being run",
        },
        MockTaskResult {
          "meta": Object {
            "friendlyTaskName": "Recommendations Task Low",
            "taskClassification": Object {
              "category": "recommendations",
              "priority": "low",
            },
            "taskName": "recommendations-task-low",
          },
          "result": "recommendations task low is being run",
        },
      ]
    `);
  });
});
