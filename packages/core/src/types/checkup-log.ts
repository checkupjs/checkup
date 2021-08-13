import { PackageJson, SetRequired } from 'type-fest';
import { Run, Result, ReportingDescriptor } from 'sarif';
import { RunOptions } from '../types/cli';
import { TaskListError, Action } from '../types/tasks';
import { CheckupConfig } from '../types/config';
import { FilePathArray } from '../utils/file-path-array';

export type RequiredRun = SetRequired<Run, 'tool' | 'results'>;
export type RequiredResult = SetRequired<Result, 'message' | 'ruleId' | 'kind' | 'level'>;

export interface CheckupLogBuilderArgs {
  analyzedPackageJson: PackageJson;
  options: RunOptions;
  paths?: FilePathArray;
}

export type RuleResults = {
  rule: ReportingDescriptor;
  results: Result[];
};

export interface AnnotationArgs {
  config: CheckupConfig;
  actions: Action[];
  errors: TaskListError[];
  timings: Record<string, number>;
}
