import { CheckupConfig } from './config';

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
  linesOfCode: {
    types: { extension: string; total: number }[];
    total: number;
  };
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
    args: {
      paths: string[];
    };
    flags: {
      config?: string;
      task?: string[];
      format: string;
      outputFile?: string;
      excludePaths?: string[];
    };
  };
  analyzedFiles: string[];
  analyzedFilesCount: number;
}
export interface CheckupMetadata2 {
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
    args: {
      paths: string[];
    };
    flags: {
      config?: string;
      tasks?: string[];
      format: string;
      outputFile?: string;
      excludePaths?: string[];
    };
  };
  analyzedFiles: string[];
  analyzedFilesCount: number;
}
