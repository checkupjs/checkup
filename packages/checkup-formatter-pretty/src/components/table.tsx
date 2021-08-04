import React, { FC } from 'react';
import { Box } from 'ink';
import { default as InkTable } from 'ink-table';

type Scalar = string | number | boolean | null | undefined;

type ScalarDict = {
  [key: string]: Scalar;
};

interface Result extends ScalarDict {
  taskName: string;
  uri: string;
  message: string;
  ruleId: string;
}

export const Table: FC<{ data: any[] }> = ({ data }) => {
  const tableData = data.map((item) => {
    const result: Result = {
      taskName: item.properties.taskDisplayName,
      uri: item.locations[0].physicalLocation.artifactLocation.uri,
      message: item.message.text,
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
