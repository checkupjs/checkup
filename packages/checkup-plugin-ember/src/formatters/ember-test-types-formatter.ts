import {
  BaseOutputWriter,
  groupDataByField,
  reduceResults,
  renderEmptyResult,
  sumOccurrences,
} from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], writer: BaseOutputWriter) {
  let groupedTaskResults = groupDataByField(taskResults, 'message.text');

  writer.section(taskResults[0].properties?.taskDisplayName, () => {
    groupedTaskResults.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByMethod = reduceResults(
        groupDataByField(resultGroup, 'properties.method')
      );
      writer.subHeader(groupedTaskResultsByMethod[0].message.text as string);
      writer.valuesList(
        groupedTaskResultsByMethod.map((result) => {
          return result.message.text === 'No results found'
            ? renderEmptyResult(result)
            : {
                title: result.properties?.method as string,
                count: result.occurrenceCount as number,
              };
        })
      );
      writer.blankLine();
    });

    writer.subHeader('tests by type');
    writer.sectionedBar(
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
