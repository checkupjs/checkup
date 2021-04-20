import {
  FormatArgs,
  groupDataByField,
  NO_RESULTS_FOUND,
  reduceResults,
  renderEmptyResult,
  sumOccurrences,
} from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], formatArgs: FormatArgs) {
  let groupedTaskResults = groupDataByField(taskResults, 'message.text');

  formatArgs.writer.section(taskResults[0].properties?.taskDisplayName, () => {
    groupedTaskResults.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByMethod = reduceResults(
        groupDataByField(resultGroup, 'properties.method')
      );
      formatArgs.writer.subHeader(groupedTaskResultsByMethod[0].message.text as string);
      formatArgs.writer.valuesList(
        groupedTaskResultsByMethod.map((result) => {
          return result.message.text === NO_RESULTS_FOUND
            ? renderEmptyResult(result)
            : {
                title: result.properties?.method as string,
                count: result.occurrenceCount as number,
              };
        })
      );
      formatArgs.writer.blankLine();
    });

    formatArgs.writer.subHeader('tests by type');
    formatArgs.writer.sectionedBar(
      groupedTaskResults.map((results: Result[]) => {
        return {
          title: results[0].message.text || '',
          count: sumOccurrences(results),
        };
      }),
      sumOccurrences(taskResults),
      'tests'
    );
  });
}
