import { TaskResult } from '@checkup/core';

export function getMockTaskResult(
  taskName: string,
  category: string,
  group: string = '',
  result: any = {}
): TaskResult {
  return {
    info: {
      taskName,
      taskDisplayName: taskName,
      category,
      group,
    },
    result,
  };
}
