import { Action, TaskError, TaskMetaData } from './tasks';

export interface MigrationCompletion {
  values: {
    completed: number;
  };
  total: number;
  calculatedPercent?: number;
}

export interface MultiStepCompletion {
  values: Record<string, number>;
  total: 100;
  calculatedPercent?: number;
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
  results: [
    {
      info: TaskMetaData;
      result: [
        {
          key: string;
          count?: number;
          percent?: MigrationCompletion | MultiStepCompletion;
          data: Array<string | object>;
        }
      ];
    }
  ];
  errors: TaskError[];
  actions: Action[];
}
