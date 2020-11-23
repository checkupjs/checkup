import { ESLintMessage, ESLintReport, ESLintResult } from '../types/parsers';
import { LintResult, TaskError } from '../types/tasks';
import { TemplateLintMessage, TemplateLintResult } from '../types/ember-template-lint';
import { Result, Location, Notification } from 'sarif';

export const NO_RESULTS_FOUND = 'No results found';

/**
 * @param lintResult {LintResult}
 * @returns Location[]
 */
function buildLocationDataFromLintResult(lintResult: LintResult): Location[] {
  const location: Location = {
    physicalLocation: {
      artifactLocation: {
        uri: lintResult.filePath,
      },
    },
  };

  if (
    (lintResult.line > 0 || lintResult.column > 0) &&
    location &&
    location.physicalLocation !== undefined
  ) {
    location.physicalLocation.region = {};
    if (lintResult.line > 0) {
      location.physicalLocation.region.startLine = lintResult.line;
    }
    if (lintResult.column > 0) {
      location.physicalLocation.region.startColumn = lintResult.column;
    }
  }

  return [location];
}

/**
 * @param paths {string[]}
 * @returns Location[]
 */
function buildLocationDataFromPath(path: string): Location[] {
  return [
    {
      physicalLocation: {
        artifactLocation: {
          uri: path,
        },
      },
    },
  ];
}

/**
 *
 * @param lintResults {LintResult[]} The LintResults used to create Result
 * @param [additionalData] {Object} Any additional data to be put into the properties bag
 */
export function buildResultsFromLintResult(
  lintResults: LintResult[],
  additionalData: object = {}
): Result[] {
  if (lintResults.length === 0) {
    return [
      {
        message: { text: NO_RESULTS_FOUND },
      },
    ];
  }

  return lintResults.map((lintResult) => {
    return {
      message: { text: lintResult.message },
      locations: buildLocationDataFromLintResult(lintResult),
      occurrenceCount: 1,
      properties: {
        ...additionalData,
        lintRuleId: lintResult.lintRuleId,
      },
    };
  });
}

/**
 * @param paths {string[]} The paths used to create Result
 * @param message {string} The message that identifies the data represented in the Result
 */
export function buildResultsFromPathArray(paths: string[], message: string): Result[] {
  if (paths.length === 0) {
    return [
      {
        message: { text: NO_RESULTS_FOUND },
        properties: { consoleMessage: message },
      },
    ];
  }

  return paths.map((path) => {
    return {
      message: { text: message },
      locations: buildLocationDataFromPath(path),
      occurrenceCount: 1,
    };
  });
}

/**
 *
 * @param key {string} An identifier used to help identify the result
 * @param data {Array<string | object>} The raw data used to derive the result's count
 */
export function buildResultsFromProperties(data: any[], message: string): Result[] {
  if (data.length === 0) {
    return [
      {
        message: { text: NO_RESULTS_FOUND },
        properties: { consoleMessage: message },
      },
    ];
  }

  return [
    {
      occurrenceCount: data.length,
      message: { text: message },
      properties: {
        data: data,
      },
    },
  ];
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
