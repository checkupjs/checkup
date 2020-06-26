import TaskList from '../src/task-list';
import { getTaskContext } from '@checkup/test-helpers';
import { BaseTask, Task, TaskContext, TaskResult } from '@checkup/core';
import { getMockTaskResult } from './__utils__/mock-task-result';

class InsightsTaskHigh extends BaseTask implements Task {
  meta = {
    taskName: 'insights-task-high',
    friendlyTaskName: 'Insights Task High',
    taskClassification: {
      category: 'bar',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }

  async run(): Promise<TaskResult> {
    return getMockTaskResult(this.meta, this.config, 'insights task high is being run');
  }
}

class InsightsTaskLow extends BaseTask implements Task {
  meta = {
    taskName: 'insights-task-low',
    friendlyTaskName: 'Insights Task Low',
    taskClassification: {
      category: 'foo',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return getMockTaskResult(this.meta, this.config, 'insights task low is being run');
  }
}

class RecommendationsTaskHigh extends BaseTask implements Task {
  meta = {
    taskName: 'recommendations-task-high',
    friendlyTaskName: 'Recommendations Task High',
    taskClassification: {
      category: 'baz',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return getMockTaskResult(this.meta, this.config, 'recommendations task high is being run');
  }
}

class RecommendationsTaskLow extends BaseTask implements Task {
  meta = {
    taskName: 'recommendations-task-low',
    friendlyTaskName: 'Recommendations Task Low',
    taskClassification: {
      category: 'bar',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return getMockTaskResult(this.meta, this.config, 'recommendations task low is being run');
  }
}

class MigrationTaskHigh extends BaseTask implements Task {
  meta = {
    taskName: 'migration-task-high',
    friendlyTaskName: 'Migration Task High',
    taskClassification: {
      category: 'foo',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return getMockTaskResult(this.meta, this.config, 'migration task high is being run');
  }
}

class MigrationTaskLow extends BaseTask implements Task {
  meta = {
    taskName: 'migration-task-low',
    friendlyTaskName: 'Migration Task Low',
    taskClassification: {
      category: 'baz',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return getMockTaskResult(this.meta, this.config, 'migration task low is being run');
  }
}

class ErrorTask extends BaseTask implements Task {
  meta = {
    taskName: 'error-task',
    friendlyTaskName: 'Error Task',
    taskClassification: {
      category: 'bar',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    throw new Error('Something went wrong in this task');
  }
}

class TaskWithoutCategory extends BaseTask implements Task {
  meta = {
    taskName: 'task-without-category',
    friendlyTaskName: 'Task Without Category',
    taskClassification: {
      category: '',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }

  async run(): Promise<TaskResult> {
    return getMockTaskResult(this.meta, this.config, 'task without category is being run');
  }
}

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
          "config": Object {},
          "data": Object {
            "result": "insights task low is being run",
          },
          "meta": Object {
            "friendlyTaskName": "Insights Task Low",
            "taskClassification": Object {
              "category": "foo",
            },
            "taskName": "insights-task-low",
          },
        },
        MockTaskResult {
          "config": Object {},
          "data": Object {
            "result": "migration task high is being run",
          },
          "meta": Object {
            "friendlyTaskName": "Migration Task High",
            "taskClassification": Object {
              "category": "foo",
            },
            "taskName": "migration-task-high",
          },
        },
        MockTaskResult {
          "config": Object {},
          "data": Object {
            "result": "recommendations task high is being run",
          },
          "meta": Object {
            "friendlyTaskName": "Recommendations Task High",
            "taskClassification": Object {
              "category": "baz",
            },
            "taskName": "recommendations-task-high",
          },
        },
        MockTaskResult {
          "config": Object {},
          "data": Object {
            "result": "migration task low is being run",
          },
          "meta": Object {
            "friendlyTaskName": "Migration Task Low",
            "taskClassification": Object {
              "category": "baz",
            },
            "taskName": "migration-task-low",
          },
        },
        MockTaskResult {
          "config": Object {},
          "data": Object {
            "result": "recommendations task low is being run",
          },
          "meta": Object {
            "friendlyTaskName": "Recommendations Task Low",
            "taskClassification": Object {
              "category": "bar",
            },
            "taskName": "recommendations-task-low",
          },
        },
        MockTaskResult {
          "config": Object {},
          "data": Object {
            "result": "insights task high is being run",
          },
          "meta": Object {
            "friendlyTaskName": "Insights Task High",
            "taskClassification": Object {
              "category": "bar",
            },
            "taskName": "insights-task-high",
          },
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
