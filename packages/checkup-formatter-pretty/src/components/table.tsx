import * as React from 'react';
import { default as InkTable } from 'ink-table';
import { Box } from 'ink';
import * as objectPath from 'object-path';
import { Result } from 'sarif';
import { RuleResults } from '@checkup/core';
import { TaskDisplayName } from '../sub-components/task-display-name';
import { getOptions } from '../get-options';

type TableOptions = {
  sumBy: {
    findGroupBy: string;
    sumValueBy: string;
  };
  rows: Record<string, string>;
};

export const Table: React.FC<{ taskResult: RuleResults }> = ({ taskResult }) => {
  let rowData = buildTableData(taskResult);

  return (
    <>
      <TaskDisplayName taskResult={taskResult} />
      <Box marginLeft={2}>
        <InkTable data={rowData} />
      </Box>
    </>
  );
};

function buildTableData(taskResult: RuleResults): any[] {
  let { rule, results } = taskResult;
  let { rows, sumBy } = getOptions<TableOptions>(rule);

  return sumBy !== undefined
    ? results.reduce((groups, result) => {
        let summedRow = groups.find((group) => {
          let propLookup = rows[sumBy.findGroupBy];
          return group[sumBy.findGroupBy] === objectPath.get(result, propLookup);
        });

        if (summedRow) {
          summedRow[sumBy.sumValueBy] = summedRow[sumBy.sumValueBy] += objectPath.get(
            result,
            rows[sumBy.sumValueBy]
          );
        } else {
          groups.push(buildRow(rows, result));
        }

        return groups;
      }, [] as Record<string, any>[])
    : results.map((result: Result) => {
        return buildRow(rows, result);
      });
}

function buildRow(rows: Record<string, string>, result: Result) {
  let rowData: Record<string, any> = {};

  for (let column of Object.keys(rows)) {
    rowData[column] = objectPath.get(result, rows[column as any]);
  }

  return rowData;
}
