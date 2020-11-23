import TaskList from '../src/task-list';
import { getTaskContext } from '@checkup/test-helpers';
import { BaseTask, Task, TaskContext } from '@checkup/core';

import { Result } from 'sarif';
const STABLE_ERROR = new Error('Something went wrong in this task');

class InsightsTaskHigh extends BaseTask implements Task {
  taskName = 'insights-task-high';
  taskDisplayName = 'Insights Task High';
  category = 'bar';

  constructor(context: TaskContext) {
    super('fake', context);
  }

  async run(): Promise<Result[]> {
    return [this.appendCheckupProperties({ message: { text: 'hi' } })];
  }
}

class InsightsTaskLow extends BaseTask implements Task {
  taskName = 'insights-task-low';
  taskDisplayName = 'Insights Task Low';
  category = 'foo';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return [this.appendCheckupProperties({ message: { text: 'hi' } })];
  }
}

class RecommendationsTaskHigh extends BaseTask implements Task {
  taskName = 'recommendations-task-high';
  taskDisplayName = 'Recommendations Task High';

  category = 'baz';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return [this.appendCheckupProperties({ message: { text: 'hi' } })];
  }
}

class RecommendationsTaskLow extends BaseTask implements Task {
  taskName = 'recommendations-task-low';
  taskDisplayName = 'Recommendations Task Low';

  category = 'bar';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return [this.appendCheckupProperties({ message: { text: 'hi' } })];
  }
}

class MigrationTaskHigh extends BaseTask implements Task {
  taskName = 'migration-task-high';
  taskDisplayName = 'Migration Task High';

  category = 'foo';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return [this.appendCheckupProperties({ message: { text: 'hi' } })];
  }
}

class MigrationTaskLow extends BaseTask implements Task {
  taskName = 'migration-task-low';
  taskDisplayName = 'Migration Task Low';

  category = 'baz';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    return [this.appendCheckupProperties({ message: { text: 'hi' } })];
  }
}

class ErrorTask extends BaseTask implements Task {
  taskName = 'error-task';
  taskDisplayName = 'Error Task';

  category = 'bar';

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<Result[]> {
    throw STABLE_ERROR;
  }
}

class TaskWithoutCategory extends BaseTask implements Task {
  taskName = 'task-without-category';
  taskDisplayName = 'Task Without Category';

  category = '';

  constructor(context: TaskContext) {
    super('fake', context);
  }

  async run(): Promise<Result[]> {
    return [this.appendCheckupProperties({ message: { text: 'hi' } })];
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
      `Task category can not be empty. Please add a category to ${taskWithoutCategory.fullyQualifiedTaskName}-task.`
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

  it('findTasks returns task instances if tasks exists with that name', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));
    taskList.registerTask(new InsightsTaskLow(getTaskContext()));

    expect(
      taskList.findTasks('fake/insights-task-high', 'fake/insights-task-low').tasksFound
    ).toHaveLength(2);
  });

  it('findTasks returns task instances that exist, as well as names of tasks not found', () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));
    let tasks = taskList.findTasks('fake/insights-task-high', 'fake/random');
    expect(tasks.tasksFound).toHaveLength(1);
    expect(tasks.tasksNotFound).toContain('fake/random');
  });

  it('runTask will run a task by taskName', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));

    let [result, errors] = await taskList.runTask('insights-task-high');

    expect(result).toMatchSnapshot();
    expect(errors).toHaveLength(0);
  });

  it('runTasks will run all registered tasks', async () => {
    let taskList = new TaskList();

    taskList.registerTask(new InsightsTaskHigh(getTaskContext()));
    taskList.registerTask(new InsightsTaskLow(getTaskContext()));

    let [results, errors] = await taskList.runTasks();

    expect(results[0]).toMatchSnapshot();
    expect(results[1]).toMatchSnapshot();
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
        Object {
          "message": Object {
            "text": "hi",
          },
          "properties": Object {
            "category": "foo",
            "group": undefined,
            "taskDisplayName": "Insights Task Low",
          },
          "ruleId": "insights-task-low",
        },
        Object {
          "message": Object {
            "text": "hi",
          },
          "properties": Object {
            "category": "foo",
            "group": undefined,
            "taskDisplayName": "Migration Task High",
          },
          "ruleId": "migration-task-high",
        },
        Object {
          "message": Object {
            "text": "hi",
          },
          "properties": Object {
            "category": "baz",
            "group": undefined,
            "taskDisplayName": "Recommendations Task High",
          },
          "ruleId": "recommendations-task-high",
        },
        Object {
          "message": Object {
            "text": "hi",
          },
          "properties": Object {
            "category": "baz",
            "group": undefined,
            "taskDisplayName": "Migration Task Low",
          },
          "ruleId": "migration-task-low",
        },
        Object {
          "message": Object {
            "text": "hi",
          },
          "properties": Object {
            "category": "bar",
            "group": undefined,
            "taskDisplayName": "Recommendations Task Low",
          },
          "ruleId": "recommendations-task-low",
        },
        Object {
          "message": Object {
            "text": "hi",
          },
          "properties": Object {
            "category": "bar",
            "group": undefined,
            "taskDisplayName": "Insights Task High",
          },
          "ruleId": "insights-task-high",
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
    expect(errors[0].taskName).toEqual('fake/error-task');
    expect(errors[0].error).toEqual(STABLE_ERROR);
  });
});
