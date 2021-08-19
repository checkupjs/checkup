import { Result } from 'sarif';
import { BaseOutputWriter } from '..';
import { groupDataByField } from '../data/formatters';
import { reduceResults, sumOccurrences } from './sarif-utils';

export function renderEmptyResult(taskResult: Result) {
  return {
    title: taskResult.properties?.consoleMessage || taskResult.properties?.taskDisplayName,
    count: 0,
  };
}

export function renderLintingSummaryResult(taskResults: Result[], writer: BaseOutputWriter) {
  let groupedTaskResultsByType = groupDataByField(taskResults, 'properties.type');

  writer.section(taskResults[0].properties?.taskDisplayName, () => {
    groupedTaskResultsByType.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByLintRule = reduceResults(
        groupDataByField(resultGroup, 'properties.lintRuleId')
      ).sort((a, b) => (b.occurrenceCount || 0) - (a.occurrenceCount || 0));
      let totalCount = sumOccurrences(groupedTaskResultsByLintRule);
      if (totalCount) {
        writer.subHeader(`${groupedTaskResultsByLintRule[0].properties?.type}s: (${totalCount})`);
        writer.valuesList(
          groupedTaskResultsByLintRule.map((result) => {
            return result.message.text === 'No results found'
              ? renderEmptyResult(result)
              : {
                  title: result.properties?.lintRuleId,
                  count: result?.occurrenceCount as number,
                };
          })
        );
        writer.blankLine();
      }
    });
  });
}
