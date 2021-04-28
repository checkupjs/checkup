import { Result } from 'sarif';
import { NO_RESULTS_FOUND } from '../data/sarif';
import { groupDataByField } from '../data/formatters';
import { FormatterArgs } from '../types/cli';
import { reduceResults, sumOccurrences } from './sarif-utils';

export function renderEmptyResult(taskResult: Result) {
  return {
    title: taskResult.properties?.consoleMessage || taskResult.properties?.taskDisplayName,
    count: 0,
  };
}

export function renderLintingSummaryResult(taskResults: Result[], args: FormatterArgs) {
  let groupedTaskResultsByType = groupDataByField(taskResults, 'properties.type');

  args.writer.section(taskResults[0].properties?.taskDisplayName, () => {
    groupedTaskResultsByType.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByLintRule = reduceResults(
        groupDataByField(resultGroup, 'properties.lintRuleId')
      ).sort((a, b) => (b.occurrenceCount || 0) - (a.occurrenceCount || 0));
      let totalCount = sumOccurrences(groupedTaskResultsByLintRule);
      if (totalCount) {
        args.writer.subHeader(
          `${groupedTaskResultsByLintRule[0].properties?.type}s: (${totalCount})`
        );
        args.writer.valuesList(
          groupedTaskResultsByLintRule.map((result) => {
            return result.message.text === NO_RESULTS_FOUND
              ? renderEmptyResult(result)
              : {
                  title: result.properties?.lintRuleId,
                  count: result?.occurrenceCount as number,
                };
          })
        );
        args.writer.blankLine();
      }
    });
  });
}
