import { NO_RESULTS_FOUND, sumOccurrences, ui, renderEmptyResult } from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[]) {
  ui.section(taskResults[0].properties?.taskDisplayName, () => {
    ui.sectionedBar(
      taskResults.map((result: Result) => {
        if (result.message.text === NO_RESULTS_FOUND) {
          renderEmptyResult(result);
        } else {
          return { title: result.message.text, count: result.occurrenceCount };
        }
      }),
      sumOccurrences(taskResults),
      'dependencies'
    );
  });
}
