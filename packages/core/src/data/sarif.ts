import { Result, Location, Notification } from 'sarif';
import { LintResult, Task, TaskListError } from '../types/tasks';

export const NO_RESULTS_FOUND = 'No results found';

type SarifTaskIdentifier = Pick<Task, 'taskName' | 'taskDisplayName' | 'category' | 'group'>;

/**
 * Builds SARIF Results from a list of LintResults.
 *
 * @param taskContext {Task} This is used to set Task properties on the Result
 * @param lintResults {LintResult[]} The LintResults used to create Result
 * @param [additionalData] {Object} Any additional data to be put into the properties bag
 * @param [customMessages] {Record<string, string>} Custom messages to be rendered for each lintRule
 */
function fromLintResults(
  taskContext: SarifTaskIdentifier,
  lintResults: LintResult[],
  additionalData: object = {},
  customMessages: Record<string, string> = {}
): Result[] {
  if (lintResults.length === 0) {
    return buildEmptyResult(taskContext);
  }

  // When files disable lint rules that are not defined in the context of our Task's analyzer, it adds a lintResult
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
 * Builds SARIF Results from a list of locations.
 *
 * @param taskContext {Task} This is used to set Task properties on the Result
 * @param locations {string[]} The paths used to create Result
 * @param message {string} The message that identifies the data represented in the Result
 */
function fromLocations(
  taskContext: SarifTaskIdentifier,
  locations: string[],
  message: string
): Result[] {
  if (locations.length === 0) {
    return buildEmptyResult(taskContext, message);
  }

  return locations.map((path) => {
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

export function fromTaskErrors(errors: TaskListError[]): Notification[] {
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
  notifications: {
    fromTaskErrors,
  },
};

function buildEmptyResult(taskContext: SarifTaskIdentifier, consoleMessage?: string): Result[] {
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
