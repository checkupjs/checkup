import {
  ErrorTask,
  InsightsTaskHigh,
  InsightsTaskLow,
  MigrationTaskHigh,
  MigrationTaskLow,
  RecommendationsTaskHigh,
  RecommendationsTaskLow,
  TaskWithoutCategory,
} from './__utils__/mock-tasks';

import TaskList from '../src/task-list';
import { getTaskContext } from '@checkup/test-helpers';

describe('TaskList', () => {
  it('can create an instance of a TaskList', () => {
    let taskList = new TaskList();

    expect(taskList).toBeInstanceOf(TaskList);
    expect(taskList.categories.size).toEqual(0);
  });

  it('registerTask adds a task to the TaskList', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));

    expect(taskList.categories.get('bar')!.size).toEqual(1);
  });

  it('registerTask fails if a task doesnt have a category set', () => {
    let taskList = new TaskList();
    let taskWithoutCategory = new TaskWithoutCategory(getTaskContext());

    expect(() => {
      taskList.registerTask(taskWithoutCategory);
    }).toThrow(
      `Task category can not be empty. Please add a category to ${taskWithoutCategory.meta.taskName}-task.`
    );
  });

  it('hasTask returns false if no task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));

    expect(taskList.hasTask('foo')).toEqual(false);
  });

  it('hasTask returns true if task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));

    expect(taskList.hasTask('insights-task-high')).toEqual(true);
  });

  it('findTask returns undefined if no task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));

    expect(taskList.findTask('foo')).toBeUndefined();
  });

  it('findTask returns task instance if task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));

    expect(taskList.findTask('insights-task-high')).toBeDefined();
  });

  it('runTask will run a task by taskName', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));

    let [result, errors] = await taskList.runTask('insights-task-high');

    expect(result!.toJson()).toMatchSnapshot();
    expect(errors).toHaveLength(0);
  });

  it('runTasks will run all registered tasks', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));
    taskList.registerTask(new InsightsTaskLow(getTaskContext()));

    let [results, errors] = await taskList.runTasks();

    expect(results[0].toJson()).toMatchSnapshot();
    expect(results[1].toJson()).toMatchSnapshot();
    expect(errors).toHaveLength(0);
  });

  it('runTasks will sort tasks in the correct order', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskLow(getTaskContext()));
    taskList.registerTask(new RecommendationsTaskHigh(getTaskContext()));
    taskList.registerTask(new MigrationTaskLow(getTaskContext()));
    taskList.registerTask(new MigrationTaskHigh(getTaskContext()));
    taskList.registerTask(new RecommendationsTaskLow(getTaskContext()));
    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));

    let [results, errors] = await taskList.runTasks();

    expect(results).toMatchInlineSnapshot(`
      Array [
        MockTaskResult {
          "config": undefined,
          "meta": Object {
            "friendlyTaskName": "Insights Task Low",
            "taskClassification": Object {
              "category": "foo",
              "type": "insights",
            },
            "taskName": "insights-task-low",
          },
          "result": "insights task low is being run",
        },
        MockTaskResult {
          "config": undefined,
          "meta": Object {
            "friendlyTaskName": "Migration Task High",
            "taskClassification": Object {
              "category": "foo",
              "type": "migrations",
            },
            "taskName": "migration-task-high",
          },
          "result": "migration task high is being run",
        },
        MockTaskResult {
          "config": undefined,
          "meta": Object {
            "friendlyTaskName": "Recommendations Task High",
            "taskClassification": Object {
              "category": "baz",
              "type": "recommendations",
            },
            "taskName": "recommendations-task-high",
          },
          "result": "recommendations task high is being run",
        },
        MockTaskResult {
          "config": undefined,
          "meta": Object {
            "friendlyTaskName": "Migration Task Low",
            "taskClassification": Object {
              "category": "baz",
              "type": "migrations",
            },
            "taskName": "migration-task-low",
          },
          "result": "migration task low is being run",
        },
        MockTaskResult {
          "config": undefined,
          "meta": Object {
            "friendlyTaskName": "Insights Task High",
            "taskClassification": Object {
              "category": "bar",
              "type": "insights",
            },
            "taskName": "insights-task-high",
          },
          "result": "insights task high is being run",
        },
        MockTaskResult {
          "config": undefined,
          "meta": Object {
            "friendlyTaskName": "Recommendations Task Low",
            "taskClassification": Object {
              "category": "bar",
              "type": "recommendations",
            },
            "taskName": "recommendations-task-low",
          },
          "result": "recommendations task low is being run",
        },
      ]
    `);
    expect(errors).toHaveLength(0);
  });

  it('Correctly captures errors in tasks', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new ErrorTask(getTaskContext()));

    let [results, errors] = await taskList.runTasks();

    expect(results).toHaveLength(0);
    expect(errors).toHaveLength(1);
    expect(errors[0].taskName).toEqual('error-task');
    expect(errors[0].error).toEqual('Something went wrong in this task');
  });
});
