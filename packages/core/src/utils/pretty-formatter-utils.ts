import { Result } from 'sarif';
import { NO_RESULTS_FOUND } from '../data/sarif';
import { groupDataByField } from '../data/formatters';
import { reduceResults, sumOccurrences } from './sarif-utils';
import { ConsoleWriter } from './console-writer';

export function renderEmptyResult(taskResult: Result) {
  return {
    title: taskResult.properties?.consoleMessage || taskResult.properties?.taskDisplayName,
    count: 0,
  };
}

export function renderLintingSummaryResult(taskResults: Result[], consoleWriter: ConsoleWriter) {
  let groupedTaskResultsByType = groupDataByField(taskResults, 'properties.type');

  consoleWriter.section(taskResults[0].properties?.taskDisplayName, () => {
    groupedTaskResultsByType.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByLintRule = reduceResults(
        groupDataByField(resultGroup, 'properties.lintRuleId')
      ).sort((a, b) => (b.occurrenceCount || 0) - (a.occurrenceCount || 0));
      let totalCount = sumOccurrences(groupedTaskResultsByLintRule);
      if (totalCount) {
        consoleWriter.subHeader(
          `${groupedTaskResultsByLintRule[0].properties?.type}s: (${totalCount})`
        );
        consoleWriter.valuesList(
          groupedTaskResultsByLintRule.map((result) => {
            return result.message.text === NO_RESULTS_FOUND
              ? renderEmptyResult(result)
              : {
                  title: result.properties?.lintRuleId,
                  count: result?.occurrenceCount as number,
                };
          })
        );
        consoleWriter.blankLine();
      }
    });
  });
}
