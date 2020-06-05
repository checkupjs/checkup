import { startCase } from 'lodash';

import { TaskItemData } from '../types/tasks';

/**
 * @param data
 * @param schema
 */
export function toPairs(
  data: Record<string, string>,
  schema: { keyName: string; valueName: string }
): object[] {
  let result = [];

  for (let key in data) {
    result.push({ [schema.keyName]: key, [schema.valueName]: data[key] });
  }

  return result;
}

export function toTaskData(results: [string, string[] | Record<string, string>][]): TaskItemData[] {
  return results.map(([type, data]) => {
    return toTaskItemData(type, data);
  });
}

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

export function fractionToPercent(numerator: number, denominator: number): string {
  return `${((numerator / denominator) * 100).toFixed()}%`;
}

export function decimalToPercent(decimal: number): string {
  return `${(decimal * 100).toFixed()}%`;
}
