import { BaseTask, TaskType, Task, TaskContext, TaskResult } from '@checkup/core';

import MockTaskResult from './mock-task-result';

export class InsightsTaskHigh extends BaseTask implements Task {
  meta = {
    taskName: 'insights-task-high',
    friendlyTaskName: 'Insights Task High',
    taskClassification: {
      taskType: TaskType.Insights,
      category: 'bar',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }

  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'insights task high is being run');
  }
}

export class InsightsTaskLow extends BaseTask implements Task {
  meta = {
    taskName: 'insights-task-low',
    friendlyTaskName: 'Insights Task Low',
    taskClassification: {
      taskType: TaskType.Insights,
      category: 'foo',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'insights task low is being run');
  }
}

export class RecommendationsTaskHigh extends BaseTask implements Task {
  meta = {
    taskName: 'recommendations-task-high',
    friendlyTaskName: 'Recommendations Task High',
    taskClassification: {
      taskType: TaskType.Recommendations,
      category: 'baz',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'recommendations task high is being run');
  }
}

export class RecommendationsTaskLow extends BaseTask implements Task {
  meta = {
    taskName: 'recommendations-task-low',
    friendlyTaskName: 'Recommendations Task Low',
    taskClassification: {
      taskType: TaskType.Recommendations,
      category: 'bar',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'recommendations task low is being run');
  }
}

export class MigrationTaskHigh extends BaseTask implements Task {
  meta = {
    taskName: 'migration-task-high',
    friendlyTaskName: 'Migration Task High',
    taskClassification: {
      taskType: TaskType.Migrations,
      category: 'foo',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'migration task high is being run');
  }
}

export class MigrationTaskLow extends BaseTask implements Task {
  meta = {
    taskName: 'migration-task-low',
    friendlyTaskName: 'Migration Task Low',
    taskClassification: {
      taskType: TaskType.Migrations,
      category: 'baz',
    },
  };

  constructor(context: TaskContext) {
    super('fake', context);
  }
  async run(): Promise<TaskResult> {
    return new MockTaskResult(this.meta, 'migration task low is being run');
  }
}

export class ErrorTask extends BaseTask implements Task {
  meta = {
    taskName: 'error-task',
    friendlyTaskName: 'Error Task',
    taskClassification: {
      taskType: TaskType.Insights,
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
