import { default as InkTable } from 'ink-table';
import { Text } from 'ink';
import * as React from 'react';
import { RuleResults } from '@checkup/core';

export const Table: React.FC<{ taskResult: RuleResults }> = ({ taskResult }) => {
  let tableData: any[] = [];
  taskResult.results.forEach((result) => {
    debugger;
    tableData.push(result.properties?.data);
    debugger;
  });
  // tableData.push({
  //   ruleId: taskResult.rule.id,
  //   total: taskResult.results.length,
  // });

  return (
    <>
      <Text>{taskResult.rule.properties?.taskDisplayName}</Text>
      <InkTable data={tableData} skeleton={CustomSkeleton} />
    </>
  );
};

const CustomSkeleton = ({ children }: React.PropsWithChildren<{}>) => (
  <Text color="green">{children}</Text>
);
