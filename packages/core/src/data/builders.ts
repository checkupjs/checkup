import { ESLintMessage, ESLintReport, ESLintResult } from '../types/parsers';
import { LintResult, TaskError } from '../types/tasks';
import { TemplateLintMessage, TemplateLintResult } from '../types/ember-template-lint';
import { Result, Location, Notification } from 'sarif';

export const NO_RESULTS_FOUND = 'No results found';

/**
 * @param lintResult {LintResult[]}
 * @returns Location[]
 */
function buildLocationDataFromLintResult(lintResult: LintResult[]): Location[] {
  return lintResult
    .map((result: LintResult) => {
      const location: Location = {
        physicalLocation: {
          artifactLocation: {
            uri: result.filePath,
          },
        },
      };

      if (
        (result.line > 0 || result.column > 0) &&
        location &&
        location.physicalLocation !== undefined
      ) {
        location.physicalLocation.region = {};
        if (result.line > 0) {
          location.physicalLocation.region.startLine = result.line;
        }
        if (result.column > 0) {
          location.physicalLocation.region.startColumn = result.column;
        }
      }

      return location;
    })
    .sort();
}

/**
 * @param paths {string[]}
 * @returns Location[]
 */
function buildLocationDataFromPathArray(paths: string[]): Location[] {
  return paths.map((path) => {
    return {
      physicalLocation: {
        artifactLocation: {
          uri: path,
        },
      },
    };
  });
}

/**
 *
 * @param lintResults {LintResult[]} The LintResults used to create Result
 * @param [additionalData] {Object} Any additional data to be put into the properties bag
 */
export function buildResultFromLintResult(
  lintResults: LintResult[],
  additionalData: object = {}
): Result {
  if (lintResults.length === 0) {
    return {
      message: { text: NO_RESULTS_FOUND },
    };
  }

  return {
    message: { text: lintResults[0].message },
    locations: buildLocationDataFromLintResult(lintResults),
    occurrenceCount: lintResults.length,
    properties: {
      ...additionalData,
      lintRuleId: lintResults[0].lintRuleId,
    },
  };
}

/**
 * @param paths {string[]} The paths used to create Result
 * @param message {string} The message that identifies the data represented in the Result
 */
export function buildResultFromPathArray(paths: string[], message: string): Result {
  if (paths.length === 0) {
    return {
      message: { text: NO_RESULTS_FOUND, properties: { consoleMessage: message } },
    };
  }

  return {
    message: { text: message },
    locations: buildLocationDataFromPathArray(paths),
    occurrenceCount: paths.length,
  };
}

/**
 *
 * @param key {string} An identifier used to help identify the result
 * @param data {Array<string | object>} The raw data used to derive the result's count
 */
export function buildResultFromProperties(data: any[], message: string): Result {
  if (data.length === 0) {
    return {
      message: { text: NO_RESULTS_FOUND, properties: { consoleMessage: message } },
    };
  }

  return {
    occurrenceCount: data.length,
    message: { text: message },
    properties: {
      data: data,
    },
  };
}

export function buildLintResultData(report: ESLintReport, cwd: string): LintResult[] {
  return report.results.reduce((transformed, lintResult) => {
    let messages = lintResult.messages.map((lintMessage) => {
      return buildLintResultDataItem(lintMessage, cwd, lintResult.filePath);
    });

    transformed.push(...messages);

    return transformed;
  }, [] as LintResult[]);
}

export function buildLintResultDataItem(
  message: ESLintMessage | TemplateLintMessage,
  cwd: string,
  filePath: string,
  additionalData: object = {}
): LintResult {
  return {
    filePath: normalizePath(filePath, cwd),
    lintRuleId: getLintRuleId(message),
    message: message.message,
    severity: message.severity,
    line: message.line,
    column: message.column,
    ...additionalData,
  };
}

export function buildLintResultsFromEslintOrTemplateLint(
  lintResults: (ESLintResult | TemplateLintResult)[],
  cwd: string
): LintResult[] {
  return lintResults.reduce((resultDataItems, lintingResults) => {
    const messages = (<any>lintingResults.messages).map(
      (lintMessage: ESLintMessage | TemplateLintMessage) => {
        return buildLintResultDataItem(lintMessage, cwd, lintingResults.filePath);
      }
    );
    resultDataItems.push(...messages);
    return resultDataItems;
  }, [] as LintResult[]);
}

function getLintRuleId(message: any) {
  if (typeof message.ruleId !== 'undefined') {
    return message.ruleId;
  } else if (typeof message.rule !== 'undefined') {
    return message.rule;
  }
  return '';
}

export function buildNotificationsFromTaskErrors(errors: TaskError[]): Notification[] {
  return errors.map((error) => {
    return {
      message: { text: error.error.message },
      associatedRule: {
        id: error.taskName,
      },
      properties: { fullError: error.error.stack },
    };
  });
}

export function normalizePath(path: string, cwd: string) {
  return path.replace(`${cwd}/`, '');
}

export function normalizePaths(paths: string[], cwd: string) {
  return paths.map((path) => normalizePath(path, cwd));
}
