import * as React from 'react';
import { default as InkTable } from 'ink-table';
import { Box } from 'ink';
import * as objectPath from 'object-path';
import { Result } from 'sarif';
import { RuleResults } from '@checkup/core';
import { TaskDisplayName } from '../sub-components/task-display-name';
import { getOptions } from '../get-options';

type TableOptions = {
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
  let { rows } = getOptions<TableOptions>(rule);

  let dataRows = results.map((result: Result) => {
    let rowData: Record<string, any> = {};

    for (let column of Object.keys(rows)) {
      rowData[column] = objectPath.get(result, rows[column]);
    }

    return rowData;
  });

  return dataRows;
}
