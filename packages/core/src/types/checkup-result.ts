import { RunOptions } from './cli.js';
import { CheckupConfig } from './config.js';

export type IndexableObject = { [key: string]: any };

export type DataSummary = {
  values: Record<string, number>;
  dataKey: string;
  total: number;
  units?: string;
};

export type RepositoryInfo = {
  totalCommits: number;
  totalFiles: number;
  age: string;
  activeDays: string;
};

export interface CheckupMetadata {
  project: {
    name: string;
    version: string;
    repository: RepositoryInfo;
  };
  cli: {
    schema: number;
    configHash: string;
    config: CheckupConfig;
    version: string;
    options: RunOptions;
  };
  analyzedFiles: string[];
  analyzedFilesCount: number;
}
