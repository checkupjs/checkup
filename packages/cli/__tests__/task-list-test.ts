import { Category, Priority, Task, TaskResult } from '@checkup/core';

import MockTask from './__utils__/mock-task';
import MockTaskResult from './__utils__/mock-task-result';
import TaskList from '../src/task-list';

//#region

class InsightsTaskHigh implements Task {
  meta = {
    taskName: 'insights-task-high',
    friendlyTaskName: 'Insights Task High',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.High,
    },
  };

  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'insights task high is being run');
  }
}

class InsightsTaskLow implements Task {
  meta = {
    taskName: 'insights-task-low',
    friendlyTaskName: 'Insights Task Low',
    taskClassification: {
      category: Category.Insights,
      priority: Priority.Low,
    },
  };

  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'insights task low is being run');
  }
}

class RecommendationsTaskHigh implements Task {
  meta = {
    taskName: 'recommendations-task-high',
    friendlyTaskName: 'Recommendations Task High',
    taskClassification: {
      category: Category.Recommendations,
      priority: Priority.High,
    },
  };

  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'recommendations task high is being run');
  }
}

class RecommendationsTaskLow implements Task {
  meta = {
    taskName: 'recommendations-task-low',
    friendlyTaskName: 'Recommendations Task Low',
    taskClassification: {
      category: Category.Recommendations,
      priority: Priority.Low,
    },
  };

  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'recommendations task low is being run');
  }
}

class MigrationTaskHigh implements Task {
  meta = {
    taskName: 'migration-task-high',
    friendlyTaskName: 'Migration Task High',
    taskClassification: {
      category: Category.Migrations,
      priority: Priority.High,
    },
  };

  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'migration task high is being run');
  }
}

class MigrationTaskLow implements Task {
  meta = {
    taskName: 'migration-task-low',
    friendlyTaskName: 'Migration Task Low',
    taskClassification: {
      category: Category.Migrations,
      priority: Priority.Low,
    },
  };

  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'migration task low is being run');
  }
}
//#endregion

describe('TaskList', () => {
  it('can create an instance of a TaskList', () => {
    let taskList = new TaskList();

    expect(taskList).toBeInstanceOf(TaskList);
    expect(taskList.categories.size).toEqual(0);
  });

  it('registerTask adds a task to the TaskList', () => {
    let taskList = new TaskList();

    taskList.registerTask(new MockTask());

    expect(taskList.categories.get(Category.Insights)!.size).toEqual(1);
  });

  it('hasTask returns false if no task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new MockTask());

    expect(taskList.hasTask('foo')).toEqual(false);
  });

  it('hasTask returns true if task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new MockTask());

    expect(taskList.hasTask('mock-task')).toEqual(true);
  });

  it('findTask returns undefined if no task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new MockTask());

    expect(taskList.findTask('foo')).toBeUndefined();
  });

  it('findTask returns task instance if task exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new MockTask());

    expect(taskList.findTask('mock-task')).toBeDefined();
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
    taskList.registerTask(new InsightsTaskHigh());

    let result = await taskList.runTasks();

    expect(result[0].json()).toMatchSnapshot();
    expect(result[1].json()).toMatchSnapshot();
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
