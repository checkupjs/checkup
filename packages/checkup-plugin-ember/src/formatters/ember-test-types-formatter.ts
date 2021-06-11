import {
  FormatterArgs,
  groupDataByField,
  reduceResults,
  renderEmptyResult,
  sumOccurrences,
} from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], args: FormatterArgs) {
  let groupedTaskResults = groupDataByField(taskResults, 'message.text');

  args.writer.section(taskResults[0].properties?.taskDisplayName, () => {
    groupedTaskResults.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByMethod = reduceResults(
        groupDataByField(resultGroup, 'properties.method')
      );
      args.writer.subHeader(groupedTaskResultsByMethod[0].message.text as string);
      args.writer.valuesList(
        groupedTaskResultsByMethod.map((result) => {
          return result.message.text === 'No results found'
            ? renderEmptyResult(result)
            : {
                title: result.properties?.method as string,
                count: result.occurrenceCount as number,
              };
        })
      );
      args.writer.blankLine();
    });

    args.writer.subHeader('tests by type');
    args.writer.sectionedBar(
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
