import { NO_RESULTS_FOUND, sumOccurrences, renderEmptyResult, FormatArgs } from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], formatArgs: FormatArgs) {
  formatArgs.writer.section(taskResults[0].properties?.taskDisplayName, () => {
    formatArgs.writer.sectionedBar(
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
