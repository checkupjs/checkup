import { NO_RESULTS_FOUND, sumOccurrences, renderEmptyResult, FormatterArgs } from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], args: FormatterArgs) {
  args.writer.section(taskResults[0].properties?.taskDisplayName, () => {
    args.writer.sectionedBar(
      taskResults.map((result: Result) => {
        return result.message.text === NO_RESULTS_FOUND
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
