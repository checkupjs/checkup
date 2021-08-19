import { sumOccurrences, renderEmptyResult, BaseOutputWriter } from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], writer: BaseOutputWriter) {
  writer.section(taskResults[0].properties?.taskDisplayName, () => {
    writer.sectionedBar(
      taskResults.map((result: Result) => {
        return result.message.text === 'No results found'
          ? renderEmptyResult(result)
          : {
              title: result.message.text as string,
              count: result.occurrenceCount as number,
            };
      }),
      sumOccurrences(taskResults),
      'dependencies'
    );
  });
}
