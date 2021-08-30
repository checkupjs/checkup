import { default as InkTable } from 'ink-table';
import * as React from 'react';
import { RuleResults } from '@checkup/core';

export const Table: React.FC<{ taskResult: RuleResults }> = ({ taskResult }) => {
  let tableData = [];
  tableData.push({
    ruleId: taskResult.rule.id,
    'result(value)': taskResult.results.length,
  });

  return <InkTable data={tableData} />;
};
