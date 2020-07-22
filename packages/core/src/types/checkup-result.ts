import { Action, TaskError, TaskMetaData } from './tasks';

interface TaskData {
  key: string;
  type: string;
  data: Array<string | object>;
}

export interface SummaryData extends TaskData {
  type: 'summary';
  count: number;
}

export interface MigrationData extends TaskData {
  type: 'migration percent';
  percent: {
    values: {
      completed: number;
    };
    total: number;
    calculatedPercent?: number;
  };
}

export interface MultiStepData extends TaskData {
  type: 'multi-step percent';
  percent: {
    values: Record<string, number>;
    total: 100;
    calculatedPercent?: number;
  };
}

export interface CheckupResult {
  info: {
    project: {
      name: string;
      version: string;
      repository: {
        totalCommits: number;
        totalFiles: number;
        age: string;
        activeDays: string;
      };
    };
    cli: {
      schema: number;
      configHash: string;
      version: string;
    };
    analyzedFilesCount: number;
  };
  results: Array<{
    info: TaskMetaData;
    result: Array<SummaryData | MigrationData | MultiStepData>;
  }>;
  errors: TaskError[];
  actions: Action[];
}
