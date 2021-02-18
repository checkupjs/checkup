import { LintResult, Task, TaskError } from '../types/tasks';
import { Result, Location, Notification } from 'sarif';

export const NO_RESULTS_FOUND = 'No results found';

type SarifTaskIdentifier = Pick<Task, 'taskName' | 'taskDisplayName' | 'category' | 'group'>;

/**
 * Builds SARIF Results from a list of LintResults.
 *
 * @param {SarifTaskIdentifier} taskContext  This is used to set Task properties on the Results
 * @param {LintResult[]} lintResults  The LintResults used to create Results
 * @param {Object} [additionalData] Any additional data to be put into the properties bag
 * @param {Record<string, string>} [customMessages]  Custom messages to be rendered for each lintRule
 * @param {Result.kind} [resultKind='fail']  This is used to specify the nature of the Results
 */
function fromLintResults(
  taskContext: SarifTaskIdentifier,
  lintResults: LintResult[],
  additionalData: Object = {},
  customMessages: Record<string, string> = {},
  resultKind: Result.kind = 'fail'
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
        kind: resultKind,
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
 * Builds SARIF Results from a list of locations.
 *
 * @param {SarifTaskIdentifier} taskContext This is used to set Task properties on the Results
 * @param {string[]} locations The paths used to create Results
 * @param {string} message The message that identifies the data represented in the Results
 * @param {Result.kind} [resultKind='informational']  This is used to specify the nature of the Results
 */
function fromLocations(
  taskContext: SarifTaskIdentifier,
  locations: string[],
  message: string,
  resultKind: Result.kind = 'informational'
): Result[] {
  if (locations.length === 0) {
    return buildEmptyResult(taskContext, message);
  }

  return locations.map((path) => {
    return {
      kind: resultKind,
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
 * Builds SARIF Results from a list of properties.
 *
 * @param {SarifTaskIdentifier} taskContext This is used to set Task properties on the Result
 * @param {T[]} data  The raw data used to derive the Result's count
 * @param {string} message The message that identifies the data represented in the Results
 * @param {Result.kind} [resultKind='informational']  This is used to specify the nature of the Results
 */
function fromData<T>(
  taskContext: SarifTaskIdentifier,
  data: T[],
  message: string,
  resultKind: Result.kind = 'informational'
): Result[] {
  if (data.length === 0) {
    return buildEmptyResult(taskContext, message);
  }

  return [
    {
      kind: resultKind,
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

export function fromTaskErrors(errors: TaskError[]): Notification[] {
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

export const sarifBuilder = {
  fromLintResults,
  fromLocations,
  fromData,
  notifications: {
    fromTaskErrors,
  },
};

function buildEmptyResult(taskContext: SarifTaskIdentifier, consoleMessage?: string): Result[] {
  return [
    {
      kind: 'notApplicable',
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
