import {
  groupDataByField,
  reduceResults,
  sumOccurrences,
  renderEmptyResult,
  BaseOutputWriter,
} from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], writer: BaseOutputWriter) {
  writer.section(taskResults[0].properties?.taskDisplayName, () => {
    writer.log(`${writer.emphasize('Octane Violations')}: ${sumOccurrences(taskResults)}`);
    writer.blankLine();

    let groupedTaskResults = groupDataByField(taskResults, 'properties.resultGroup');

    groupedTaskResults.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByLintRuleId = reduceResults(
        groupDataByField(resultGroup, 'properties.lintRuleId')
      );

      writer.subHeader(groupedTaskResultsByLintRuleId[0].properties?.resultGroup);
      writer.valuesList(
        groupedTaskResultsByLintRuleId.map((result) => {
          return result.message.text === 'No results found'
            ? renderEmptyResult(result)
            : {
                title: result.properties?.lintRuleId as string,
                count: result.occurrenceCount as number,
              };
        }),
        'violations'
      );
      writer.blankLine();
    });
  });
}
