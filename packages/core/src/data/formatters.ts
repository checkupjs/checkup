export function toPercent(numeratorOrValue: number, denominator?: number): string {
  let value: number =
    typeof denominator === 'number' ? numeratorOrValue / denominator : numeratorOrValue;

  return `${(value * 100).toFixed()}%`;
}

export function groupDataByField<T>(results: T[], field: string): T[][] {
  const map = new Map([...results].map((result) => [getMultiLevelProp(result, field), []]));
  results.forEach((result) => {
    map.get(getMultiLevelProp(result, field))?.push(result as never);
  });
  return [...map.values()];
}

/*
 * This function accesses a variable property from within an Object that is multiple levels deep
 */
function getMultiLevelProp(obj: any, keys: string) {
  return keys.split('.').reduce(function (cur: any, key: string) {
    return cur[key];
  }, obj);
}
