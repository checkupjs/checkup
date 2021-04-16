import { NO_RESULTS_FOUND, sumOccurrences, ConsoleWriter, renderEmptyResult } from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[]) {
  let consoleWriter = new ConsoleWriter();

  consoleWriter.section(taskResults[0].properties?.taskDisplayName, () => {
    consoleWriter.sectionedBar(
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
