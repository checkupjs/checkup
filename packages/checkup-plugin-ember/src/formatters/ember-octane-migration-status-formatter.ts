import {
  groupDataByField,
  reduceResults,
  sumOccurrences,
  FormatterArgs,
  renderEmptyResult,
} from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], args: FormatterArgs) {
  args.writer.section(taskResults[0].properties?.taskDisplayName, () => {
    args.writer.log(
      `${args.writer.emphasize('Octane Violations')}: ${sumOccurrences(taskResults)}`
    );
    args.writer.blankLine();

    let groupedTaskResults = groupDataByField(taskResults, 'properties.resultGroup');

    groupedTaskResults.forEach((resultGroup: Result[]) => {
      let groupedTaskResultsByLintRuleId = reduceResults(
        groupDataByField(resultGroup, 'properties.lintRuleId')
      );

      args.writer.subHeader(groupedTaskResultsByLintRuleId[0].properties?.resultGroup);
      args.writer.valuesList(
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
      args.writer.blankLine();
    });
  });
}
