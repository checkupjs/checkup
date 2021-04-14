import {
  groupDataByField,
  NO_RESULTS_FOUND,
  reduceResults,
  sumOccurrences,
  ui,
  renderEmptyResult,
} from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[]) {
  let groupedTaskResults = groupDataByField(taskResults, 'message.text');

  ui.section(taskResults[0].properties?.taskDisplayName, () => {
    groupedTaskResults.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByMethod = reduceResults(
        groupDataByField(resultGroup, 'properties.method')
      );
      ui.subHeader(groupedTaskResultsByMethod[0].message.text);
      ui.valuesList(
        groupedTaskResultsByMethod.map((result) => {
          if (result.message.text === NO_RESULTS_FOUND) {
            renderEmptyResult(result);
          } else {
            return { title: result.properties?.method, count: result.occurrenceCount };
          }
        })
      );
      ui.blankLine();
    });

    ui.subHeader('tests by type');
    ui.sectionedBar(
      groupedTaskResults.map((results: Result[]) => {
        return {
          title: results[0].message.text,
          count: sumOccurrences(results),
        };
      }),
      sumOccurrences(taskResults),
      'tests'
    );
  });
}
