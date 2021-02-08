import { Result } from 'sarif';

export function sumOccurrences(results: Result[]) {
  return results.reduce((total, result) => total + (result.occurrenceCount || 0), 0);
}

/*
 * This function takes in multiple Results with different locations but the same message,
 * and return a single Result to be rendered in the console (with occurrenceCounts added together)
 */
export function reduceResults(groupedResults: Result[][]): Result[] {
  return groupedResults.map((results) => {
    const result = results[0];
    result.occurrenceCount = sumOccurrences(results);
    return result;
  });
}
