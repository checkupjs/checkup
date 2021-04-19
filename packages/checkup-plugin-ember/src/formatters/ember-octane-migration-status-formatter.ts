import {
  groupDataByField,
  NO_RESULTS_FOUND,
  reduceResults,
  sumOccurrences,
  ConsoleWriter,
  renderEmptyResult,
} from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], consoleWriter: ConsoleWriter) {
  consoleWriter.section(taskResults[0].properties?.taskDisplayName, () => {
    consoleWriter.log(
      `${consoleWriter.emphasize('Octane Violations')}: ${sumOccurrences(taskResults)}`
    );
    consoleWriter.blankLine();

    let groupedTaskResults = groupDataByField(taskResults, 'properties.resultGroup');

    groupedTaskResults.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByLintRuleId = reduceResults(
        groupDataByField(resultGroup, 'properties.lintRuleId')
      );

      consoleWriter.subHeader(groupedTaskResultsByLintRuleId[0].properties?.resultGroup);
      consoleWriter.valuesList(
        groupedTaskResultsByLintRuleId.map((result) => {
          return result.message.text === NO_RESULTS_FOUND
            ? renderEmptyResult(result)
            : {
                title: result.properties?.lintRuleId as string,
                count: result.occurrenceCount as number,
              };
        }),
        'violations'
      );
      consoleWriter.blankLine();
    });
  });
}
