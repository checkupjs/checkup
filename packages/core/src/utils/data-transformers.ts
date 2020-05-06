import * as startCase from 'startcase';

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

export function toTaskData(results: [string, string[] | Record<string, string>][]) {
  return results.map(([type, data]) => {
    return toTaskItemData(type, data);
  });
}

export function toTaskItemData(type: string, data: string[] | Record<string, string>) : TaskItemData {
  return {
    displayName: startCase(type),
    type,
    data,
    total: Array.isArray(data) ? data.length : Object.keys(data).length,
  };
}
