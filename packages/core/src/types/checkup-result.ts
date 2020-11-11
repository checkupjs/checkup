import { CheckupConfig } from './config';

export type IndexableObject = { [key: string]: any };

export type DataSummary = {
  values: Record<string, number>;
  dataKey: string;
  total: number;
  units?: string;
};

interface BaseResult {
  key: string;
  type: string;
  data: Array<string | IndexableObject>;
}

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
