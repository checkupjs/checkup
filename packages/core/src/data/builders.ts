import {
  SummaryResult,
  MultiValueResult,
  LookupValueResult,
  IndexableObject,
} from '../types/checkup-result';
import { ESLintMessage, ESLintReport } from '../types/parsers';
import { LintResult } from '../types/tasks';
import { TemplateLintMessage } from '../types/ember-template-lint';

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
 * Use this type if you want your result's `dataSummary.values` to contain
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
 * let multiValueResult = buildMultiValueResult('foo', data, 'baz', ['bar']);
 *
 * @param key {string} An identifier used to help identify the result
 * @param data {Array<IndexableObject>} The raw data used to derive the result's values
 * @param dataKey {string} Used to reference a property in the data who's value is then used to calculate summary counts
 * @param valueKeys {string[]} Keys representing the summarized values that are used to build the values property
 * @param total {number} The total value (usually the data length), often acting as the denominator in a percentage calculation
 */
function buildMultiValueResult(
  key: string,
  data: Array<object>,
  dataKey: string,
  valueKeys: string[],
  total?: number
): MultiValueResult {
  return {
    key,
    type: 'multi-value',
    dataSummary: {
      values: buildMultiValues(data, dataKey, valueKeys),
      dataKey,
      total: total || data.length,
    },
    data,
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
 * Use this type if you want your result's `dataSummary.values` to be derived
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
): MultiValueResult {
  return {
    key,
    type: 'multi-value',
    dataSummary: {
      values: buildDerivedValues(data, dataKey),
      dataKey,
      total: total || data.length,
    },
    data,
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

/**
 * Builds a {LookupValueResult}.
 *
 * Use this type if you want your result's `dataSummary.values` to be derived
 * from the unique values of the specified `dataKey` in `data`, you
 * want the values object to contain _all_ the unique values found in `data`, and
 * you would the associated counts of these keys to be derived from the value looked
 * up in `valueKey`.
 *
 * The below example allows us build our values keys from the list of values present
 * in the `dataKey`, or value of, 'baz'. Each unique value found
 * in the 'baz' `dataKey` will have an associated value of the accumulated counts derived
 * from `valueKey` `total`.
 *
 * @example
 *
 * let data = [
 *   {
 *     foo: true,
 *     baz: 'bar',
 *     total: 0,
 *   },
 *   {
 *     foo: true,
 *     baz: 'bork',
 *     total: 2,
 *   },
 * ];
 *
 * let derivedValueResult = buildDerivedValueResult('foo', data, 'baz', 'total');
 *
 * @param key {string} An identifier used to help identify the result
 * @param data {Array<IndexableObject>} The raw data used to derive the result's summary values
 * @param dataKey {string} Used to reference a property in the data who's value is then used to calculate summary counts. The
 *                         values of the data looked up via the dataKey are used to create the list of values in the returned result.
 * @param valueKey {string} Used to reference a property in the data who's value is used as the number value used for summary counts.
 *                         The values of the data looked up via the valueKey are used to aggregate the counts for the returned result.
 * @param total {number} The total value (usually the data length), often acting as the denominator in a percentage calculation
 */
function buildLookupValueResult(
  key: string,
  data: Array<IndexableObject>,
  dataKey: string,
  valueKey: string,
  total?: number
): LookupValueResult {
  let [values, calculatedTotal] = buildLookupValues(data, dataKey, valueKey);

  return {
    key,
    type: 'lookup-value',
    dataSummary: {
      values,
      dataKey,
      valueKey,
      total: total || calculatedTotal,
    },
    data,
  };
}

function buildLookupValues(
  data: Array<IndexableObject>,
  dataKey: string,
  valueKey: string
): [{ [key: string]: number }, number] {
  let lookupValues: { [key: string]: number } = {};
  let total: number = 0;

  data.forEach((datum: IndexableObject) => {
    let dataValueCount = lookupValues[datum[dataKey]] || 0;
    let value = dataValueCount + datum[valueKey];

    lookupValues[datum[dataKey]] = value;
  });

  total = Object.values(lookupValues).reduce((total, value) => total + value, 0);

  return [lookupValues, total];
}

function buildLintResultData(report: ESLintReport, cwd: string) {
  return report.results.reduce((transformed, lintResult) => {
    let messages = lintResult.messages.map((lintMessage) => {
      return buildLintResultDataItem(lintMessage, cwd, lintResult.filePath);
    });

    transformed.push(...messages);

    return transformed;
  }, [] as LintResult[]);
}

function buildLintResultDataItem(
  message: ESLintMessage | TemplateLintMessage,
  cwd: string,
  filePath: string,
  additionalData: object = {}
): LintResult {
  return {
    filePath: normalizePath(filePath, cwd),
    ruleId: getRuleId(message),
    message: message.message,
    severity: message.severity,
    line: message.line,
    column: message.column,
    ...additionalData,
  };
}

function getRuleId(message: any) {
  if (typeof message.ruleId !== 'undefined') {
    return message.ruleId;
  } else if (typeof message.rule !== 'undefined') {
    return message.rule;
  }
  return '';
}

function normalizePath(path: string, cwd: string) {
  return path.replace(cwd, '');
}

function normalizePaths(paths: string[], cwd: string) {
  return paths.map((path) => normalizePath(path, cwd));
}

export {
  buildSummaryResult,
  buildMultiValueResult,
  buildDerivedValueResult,
  buildLookupValueResult,
  buildLintResultData,
  buildLintResultDataItem,
  normalizePath,
  normalizePaths,
};
