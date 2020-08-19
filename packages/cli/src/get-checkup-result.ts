import { CheckupResult, TaskResult, TaskError, Action } from '@checkup/core';
import { MetaTaskResult } from './types';

export function getCheckupResult(
  info: MetaTaskResult[],
  results: TaskResult[],
  errors: TaskError[],
  actions: Action[],
  timings: Record<string, number>
): CheckupResult {
  let _info = Object.assign({}, ...info.map((result) => result.toJson()));

  _info.cli.timings = timings;

  return {
    info: _info,
    results,
    errors,
    actions,
  };
}
