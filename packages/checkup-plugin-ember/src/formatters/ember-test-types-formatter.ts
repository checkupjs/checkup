import {
  groupDataByField,
  NO_RESULTS_FOUND,
  reduceResults,
  sumOccurrences,
  ConsoleWriter,
  renderEmptyResult,
} from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[]) {
  let groupedTaskResults = groupDataByField(taskResults, 'message.text');
  let consoleWriter = new ConsoleWriter();

  consoleWriter.section(taskResults[0].properties?.taskDisplayName, () => {
    groupedTaskResults.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByMethod = reduceResults(
        groupDataByField(resultGroup, 'properties.method')
      );
      consoleWriter.subHeader(groupedTaskResultsByMethod[0].message.text as string);
      consoleWriter.valuesList(
        groupedTaskResultsByMethod.map((result) => {
          return result.message.text === NO_RESULTS_FOUND
            ? renderEmptyResult(result)
            : {
                title: result.properties?.method as string,
                count: result.occurrenceCount as number,
              };
        })
      );
      consoleWriter.blankLine();
    });

    consoleWriter.subHeader('tests by type');
    consoleWriter.sectionedBar(
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
