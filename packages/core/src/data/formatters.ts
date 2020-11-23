import { Result } from 'sarif';
import { sumOccurrences } from '../utils/sarif-utils';

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
 * This function takes in multiple Results with different locations but the same message,
 * and return a single Result to be rendered in the console (with occurrenceCounts added together)
 */
export function combineResultsForRendering(groupedResults: Result[][]): Result[] {
  return groupedResults.map((results) => {
    const result = results[0];
    result.occurrenceCount = sumOccurrences(results);
    return result;
  });
}

/*
 * This function accesses a variable property from within an Object that is multiple levels deep
 */
function getMultiLevelProp(obj: any, keys: string) {
  return keys.split('.').reduce(function (cur: any, key: string) {
    return cur[key];
  }, obj);
}
