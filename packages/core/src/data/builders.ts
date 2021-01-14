import { ESLintMessage, ESLintReport, ESLintResult } from '../types/parsers';
import { LintResult, TaskError, Task } from '../types/tasks';
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
 * @param taskContext {Task} This is used to set Task properties on the Result
 * @param lintResults {LintResult[]} The LintResults used to create Result
 * @param [additionalData] {Object} Any additional data to be put into the properties bag
 * @param [customMessages] {Record<string, string>} Custom messages to be rendered for each lintRule
 */
export function buildResultsFromLintResult(
  taskContext: Pick<Task, 'taskName' | 'taskDisplayName' | 'category' | 'group'>,
  lintResults: LintResult[],
  additionalData: object = {},
  customMessages: Record<string, string> = {}
): Result[] {
  if (lintResults.length === 0) {
    return buildEmptyResult(taskContext);
  }

  // When files disable lint rules that are not defined in the context of our Task's parser, it adds a lintResult
  // that indicates that the rule was not found. Since this is not an actual error || warning, we filter them out
  const lintRuleNotDefinedRegex = new RegExp('Definition for rule .* was not found');

  return lintResults
    .filter((lintResult) => {
      return lintRuleNotDefinedRegex.test(lintResult.message) === false;
    })
    .map((lintResult) => {
      let message =
        (lintResult.lintRuleId && customMessages[lintResult.lintRuleId]) ?? lintResult.message;

      return {
        locations: buildLocationDataFromLintResult(lintResult),
        message: { text: message },
        occurrenceCount: 1,
        ruleId: taskContext.taskName,
        properties: {
          ...{
            taskDisplayName: taskContext.taskDisplayName,
            category: taskContext.category,
            group: taskContext.group,
          },
          ...additionalData,
          lintRuleId: lintResult.lintRuleId,
        },
      };
    });
}

/**
 * @param taskContext {Task} This is used to set Task properties on the Result
 * @param paths {string[]} The paths used to create Result
 * @param message {string} The message that identifies the data represented in the Result
 */
export function buildResultsFromPathArray(
  taskContext: Pick<Task, 'taskName' | 'taskDisplayName' | 'category' | 'group'>,
  paths: string[],
  message: string
): Result[] {
  if (paths.length === 0) {
    return buildEmptyResult(taskContext, message);
  }

  return paths.map((path) => {
    return {
      locations: buildLocationDataFromPath(path),
      message: { text: message },
      occurrenceCount: 1,
      ruleId: taskContext.taskName,
      properties: {
        taskDisplayName: taskContext.taskDisplayName,
        category: taskContext.category,
        group: taskContext.group,
      },
    };
  });
}

/**
 * @param taskContext {Task} This is used to set Task properties on the Result
 * @param key {string} An identifier used to help identify the result
 * @param data {Array<string | object>} The raw data used to derive the result's count
 */
export function buildResultsFromProperties(
  taskContext: Pick<Task, 'taskName' | 'taskDisplayName' | 'category' | 'group'>,
  data: any[],
  message: string
): Result[] {
  if (data.length === 0) {
    return buildEmptyResult(taskContext, message);
  }

  return [
    {
      message: { text: message },
      ruleId: taskContext.taskName,
      occurrenceCount: data.length,
      properties: {
        data: data,
        ...{
          taskDisplayName: taskContext.taskDisplayName,
          category: taskContext.category,
          group: taskContext.group,
        },
      },
    },
  ];
}

function buildEmptyResult(
  taskContext: Pick<Task, 'taskName' | 'taskDisplayName' | 'category' | 'group'>,
  consoleMessage?: string
): Result[] {
  return [
    {
      message: { text: NO_RESULTS_FOUND },
      ruleId: taskContext.taskName,
      properties: {
        consoleMessage,
        ...{
          taskDisplayName: taskContext.taskDisplayName,
          category: taskContext.category,
          group: taskContext.group,
        },
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
