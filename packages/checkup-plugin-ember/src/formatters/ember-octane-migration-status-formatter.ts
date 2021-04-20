import {
  groupDataByField,
  NO_RESULTS_FOUND,
  reduceResults,
  sumOccurrences,
  FormatArgs,
  renderEmptyResult,
} from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], formatArgs: FormatArgs) {
  formatArgs.writer.section(taskResults[0].properties?.taskDisplayName, () => {
    formatArgs.writer.log(
      `${formatArgs.writer.emphasize('Octane Violations')}: ${sumOccurrences(taskResults)}`
    );
    formatArgs.writer.blankLine();

    let groupedTaskResults = groupDataByField(taskResults, 'properties.resultGroup');

    groupedTaskResults.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByLintRuleId = reduceResults(
        groupDataByField(resultGroup, 'properties.lintRuleId')
      );

      formatArgs.writer.subHeader(groupedTaskResultsByLintRuleId[0].properties?.resultGroup);
      formatArgs.writer.valuesList(
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
      formatArgs.writer.blankLine();
    });
  });
}
