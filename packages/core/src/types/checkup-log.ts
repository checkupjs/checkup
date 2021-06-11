import { SetRequired } from 'type-fest';
import { Run, Result } from 'sarif';
import { RunOptions } from '../types/cli';
import { TaskListError, Action } from '../types/tasks';
import { CheckupConfig } from '../types/config';
import { FilePathArray } from '../utils/file-path-array';

export type RequiredRun = SetRequired<Run, 'tool' | 'results'>;
export type RequiredResult = SetRequired<Result, 'message' | 'ruleId' | 'kind' | 'level'>;

export interface CheckupLogBuilderArgs {
  packageName: string;
  packageVersion: string;
  config: CheckupConfig;
  options: RunOptions;
  actions: Action[];
  errors: TaskListError[];
  paths?: FilePathArray;
  taskTimings: Record<string, number>;
}
