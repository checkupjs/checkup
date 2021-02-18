import { NO_RESULTS_FOUND } from '../data/sarif';
import { groupDataByField } from '../data/formatters';
import { reduceResults, sumOccurrences } from './sarif-utils';
import { ui } from './ui';
import { Result } from 'sarif';

export function renderEmptyResult(taskResult: Result) {
  ui.value({
    title: taskResult.properties?.consoleMessage || taskResult.properties?.taskDisplayName,
    count: 0,
  });
}

export function renderLintingSummaryResult(taskResults: Result[]) {
  let groupedTaskResultsByType = groupDataByField(taskResults, 'properties.type');

  ui.section(taskResults[0].properties?.taskDisplayName, () => {
    groupedTaskResultsByType.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByLintRule = reduceResults(
        groupDataByField(resultGroup, 'properties.lintRuleId')
      ).sort((a, b) => (b.occurrenceCount || 0) - (a.occurrenceCount || 0));
      let totalCount = sumOccurrences(groupedTaskResultsByLintRule);
      if (totalCount) {
        ui.subHeader(`${groupedTaskResultsByLintRule[0].properties?.type}s: (${totalCount})`);
        ui.valuesList(
          groupedTaskResultsByLintRule.map((result) => {
            if (result.message.text === NO_RESULTS_FOUND) {
              renderEmptyResult(result);
            } else {
              return { title: result.properties?.lintRuleId, count: result?.occurrenceCount };
            }
          })
        );
        ui.blankLine();
      }
    });
  });
}
