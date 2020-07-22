import { SummaryData } from '../types/checkup-result';

/**
 * Formats the supplied data to adhere to the SummaryData schema.
 *
 * @param key {string}
 * @param data {Array<string | object>}
 */
export function format(key: string, data: Array<string | object>): SummaryData {
  return {
    key,
    type: 'summary',
    data,
    count: Array.isArray(data) ? data.length : Object.keys(data).length,
  };
}
