import { SummaryResult, MultiStepResult } from './types/checkup-result';

/**
 * Formats the supplied data to adhere to the SummaryData schema.
 *
 * @param key {string}
 * @param data {Array<string | object>}
 */
function buildSummary(key: string, data: Array<string | object>): SummaryResult {
  return {
    key,
    type: 'summary',
    data,
    count: data.length,
  };
}

function buildMultiStep(
  key: string,
  data: Array<string | object>,
  values: Record<string, number>,
  total: number
): MultiStepResult {
  return {
    key,
    type: 'multi-step',
    data,
    percent: {
      values,
      total,
    },
  };
}

export { buildSummary, buildMultiStep };
