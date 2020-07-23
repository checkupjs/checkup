import { Action, TaskError, TaskMetaData } from './tasks';
import { CheckupConfig } from './config';

interface TaskResult {
  info: TaskMetaData;
  results: Result[];
}

interface BaseResult {
  key: string;
  type: string;
  data: Array<string | object>;
}

export interface SummaryResult extends BaseResult {
  type: 'summary';
  count: number;
}

export interface MultiStepResult extends BaseResult {
  type: 'multi-step';
  percent: {
    values: Record<string, number>;
    total: number;
  };
}

type Result = SummaryResult | MultiStepResult;

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
      config: CheckupConfig;
      version: string;
      flags: {
        paths: [];
      };
    };
    analyzedFilesCount: number;
  };
  results: TaskResult[];
  errors: TaskError[];
  actions: Action[];
}
