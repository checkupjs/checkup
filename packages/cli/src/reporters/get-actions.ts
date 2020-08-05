import { Action, TaskResult } from '@checkup/core';

export function getActions(results: TaskResult[]) {
  return results
    .filter((taskResult) => taskResult.actions)
    .flatMap((taskResult) => taskResult.actions) as Action[];
}
