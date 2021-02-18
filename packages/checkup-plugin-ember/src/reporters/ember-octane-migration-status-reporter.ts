import {
  groupDataByField,
  NO_RESULTS_FOUND,
  reduceResults,
  sumOccurrences,
  ui,
  renderEmptyResult,
} from '@checkup/core';
import { Result } from 'sarif';

export function report(taskResults: Result[]) {
  ui.section(taskResults[0].properties?.taskDisplayName, () => {
    ui.log(`${ui.emphasize('Octane Violations')}: ${sumOccurrences(taskResults)}`);
    ui.blankLine();

    let groupedTaskResults = groupDataByField(taskResults, 'properties.resultGroup');

    groupedTaskResults.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByLintRuleId = reduceResults(
        groupDataByField(resultGroup, 'properties.lintRuleId')
      );

      ui.subHeader(groupedTaskResultsByLintRuleId[0].properties?.resultGroup);
      ui.valuesList(
        groupedTaskResultsByLintRuleId.map((result) => {
          if (result.message.text === NO_RESULTS_FOUND) {
            renderEmptyResult(result);
          } else {
            return { title: result.properties?.lintRuleId, count: result.occurrenceCount };
          }
        }),
        'violations'
      );
      ui.blankLine();
    });
  });
}
