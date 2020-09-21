import { Action } from '@checkup/core';
import { Invocation, Log, Result } from 'sarif';
import { MetaTaskResult } from './types';

export function getLog(
  info: MetaTaskResult[],
  taskResults: Result[],
  actions: Action[],
  timings: Record<string, number>,
  invocation: Invocation
): Log {
  let _info = Object.assign({}, ...info.map((result) => result.toJson()));

  _info.cli.timings = timings;
  _info.actions = actions;

  return {
    version: '2.1.0',
    properties: _info,
    runs: [
      {
        results: taskResults,
        invocations: [invocation],
        tool: { driver: { name: 'Checkup' } },
      },
    ],
  };
}
