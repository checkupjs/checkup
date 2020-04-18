import { Category, Priority, Task, TaskResult } from '@checkup/core';

import MockTaskResult from './mock-task-result';

export class InsightsTaskHigh implements Task {
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

export class InsightsTaskLow implements Task {
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

export class RecommendationsTaskHigh implements Task {
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

export class RecommendationsTaskLow implements Task {
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

export class MigrationTaskHigh implements Task {
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

export class MigrationTaskLow implements Task {
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
