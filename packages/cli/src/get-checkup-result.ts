import { CheckupResult, TaskResult, TaskError, Action } from '@checkup/core';
import { MetaTaskResult } from './types';

export function getCheckupResult(
  info: MetaTaskResult[],
  results: TaskResult[],
  errors: TaskError[],
  actions: Action[]
): CheckupResult {
  return {
    info: Object.assign({}, ...info.map((result) => result.toJson())),
    results,
    errors,
    actions,
  };
}
