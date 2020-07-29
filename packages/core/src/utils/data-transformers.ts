import { startCase } from 'lodash';

import { TaskItemData } from '../types/tasks';

export function toTaskItemData(
  type: string,
  data: string[] | Record<string, string>
): TaskItemData {
  return {
    displayName: startCase(type),
    type,
    data,
    total: Array.isArray(data) ? data.length : Object.keys(data).length,
  };
}

export function toPercent(numeratorOrValue: number, denominator?: number): string {
  let value: number =
    typeof denominator === 'number' ? numeratorOrValue / denominator : numeratorOrValue;

  return `${(value * 100).toFixed()}%`;
}
