import {
  SummaryResult,
  MultiValueResult,
  DerivedValueResult,
  IndexableObject,
} from './types/checkup-result';

/**
 * Builds a {SummaryResult}.
 *
 * @param key {string} An identifier used to help identify the result
 * @param data {Array<string | object>} The raw data used to derive the result's count
 */
function buildSummaryResult(key: string, data: Array<string | IndexableObject>): SummaryResult {
  return {
    key,
    type: 'summary',
    data,
    count: data.length,
  };
}

/**
 * Builds a {MultiValueResult}.
 *
 * Use this type if you want your result's `percent.values` to contain
 * specific values that may or may not be included in the values found
 * in `data`.
 *
 * The below example allows us to accumulate the count of the occurrence of
 * the string 'bar' by looking it up via the `dataKey`, or value of, 'baz'.
 * The result is stored in the values object, under the property matching
 * the string searched for, 'bar'.
 *
 * @example
 *
 * let data = [
 *   {
 *     foo: true,
 *     baz: 'bar',
 *   },
 *   {
 *     foo: true,
 *     baz: 'bar',
 *   },
 * ];
 *
 * let multiValueResult = buildMultiValueResult('foo', data, 'baz', { bar: 0 });
 *
 * @param key {string} An identifier used to help identify the result
 * @param data {Array<IndexableObject>} The raw data used to derive the result's values
 * @param dataKey {string} Used to reference a property in the data who's value is then used to calculate summary counts
 * @param valueKeys {string[]} Keys representing the summarized values that are used to build the values property
 * @param total {number} The total value (usually the data length), often acting as the denominator in a percentage calculation
 */
function buildMultiValueResult(
  key: string,
  data: Array<IndexableObject>,
  dataKey: string,
  valueKeys: string[],
  total?: number
): MultiValueResult {
  return {
    key,
    type: 'multi-value',
    data,
    percent: {
      values: buildMultiValues(data, dataKey, valueKeys),
      dataKey,
      total: total || data.length,
    },
  };
}

function buildMultiValues(data: Array<IndexableObject>, dataKey: string, valueKeys: string[]) {
  let values = Object.fromEntries([...valueKeys].map((key) => [key, 0]));

  data.forEach((datum) => {
    let value = datum[dataKey];

    if (Object.prototype.hasOwnProperty.call(values, value)) {
      values[value] += 1;
    }
  });

  return values;
}

/**
 * Builds a {DerivedValueResult}.
 *
 * Use this type if you want your result's `percent.values` to be derived
 * from the unique values of the specified `dataKey` in `data`, and you
 * want the values object to contain _all_ the unique values found in `data`.
 *
 * The below example allows us to accumulate the count of all the occurrences
 * of values present in the `dataKey`, or value of, 'baz'. Each unique value found
 * in the 'baz' `dataKey` has an accumulated count as a property of `values`.
 *
 * @example
 *
 * let data = [
 *   {
 *     foo: true,
 *     baz: 'bar',
 *   },
 *   {
 *     foo: true,
 *     baz: 'bork',
 *   },
 * ];
 *
 * let derivedValueResult = buildDerivedValueResult('foo', data, 'baz');
 *
 * @param key {string} An identifier used to help identify the result
 * @param data {Array<IndexableObject>} The raw data used to derive the result's summary values
 * @param dataKey {string} Used to reference a property in the data who's value is then used to calculate summary counts. The
 *                         values of the data looked up via the dataKey are used to create the list of values in the returned result.
 * @param total {number} The total value (usually the data length), often acting as the denominator in a percentage calculation

 */
function buildDerivedValueResult(
  key: string,
  data: Array<IndexableObject>,
  dataKey: string,
  total?: number
): DerivedValueResult {
  return {
    key,
    type: 'derived-value',
    data,
    percent: {
      values: buildDerivedValues(data, dataKey),
      dataKey,
      total: total || data.length,
    },
  };
}

function buildDerivedValues(data: Array<IndexableObject>, dataKey: string) {
  let uniqueValues: { [key: string]: number } = {};

  data.forEach((datum: IndexableObject) => {
    let dataValueCount = uniqueValues[datum[dataKey]];

    uniqueValues[datum[dataKey]] = typeof dataValueCount === 'undefined' ? 1 : dataValueCount + 1;
  });

  return uniqueValues;
}

export { buildSummaryResult, buildMultiValueResult, buildDerivedValueResult };
