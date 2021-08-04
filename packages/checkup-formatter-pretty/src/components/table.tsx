import React, { FC } from 'react';
import { Box } from 'ink';
import { default as InkTable } from 'ink-table';

type Scalar = string | number | boolean | null | undefined;

type ScalarDict = {
  [key: string]: Scalar;
};

interface Result extends ScalarDict {
  taskName: string;
  startColumn: number;
  startLine: number;
  ruleId: string;
}

export const Table: FC<{ data: any[] }> = ({ data }) => {
  const tableData = data.map((item) => {
    const result: Result = {
      taskName: item.properties.taskDisplayName,
      startColumn: item.locations[0].physicalLocation.region.startColumn,
      startLine: item.locations[0].physicalLocation.region.startLine,
      ruleId: item.ruleId,
    };

    return result;
  });

  return (
    <Box>
      <InkTable data={tableData} />
    </Box>
  );
};
