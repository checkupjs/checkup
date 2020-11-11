import { Result } from 'sarif';

export function sumOccurrences(results: Result[]) {
  return results.reduce((total, result) => total + (result.occurrenceCount || 0), 0);
}
