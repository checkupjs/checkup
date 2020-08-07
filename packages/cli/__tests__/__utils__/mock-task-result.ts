import { TaskMetaData } from '@checkup/core';

export function getMockTaskResult(meta: TaskMetaData, result: any = {}) {
  return {
    info: meta,
    result,
  };
}
