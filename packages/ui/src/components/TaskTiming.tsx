import * as React from 'react';
import { Text } from 'ink';
import { default as InkTable } from 'ink-table';

export const TaskTiming: React.FC<{ timings: Record<string, number> }> = ({ timings }) => {
  let total = Object.values(timings).reduce((total, timing) => (total += timing), 0);
  let tableData: any[] = [];

  if (process.env.CHECKUP_TIMING !== '1') {
    return <></>;
  }

  Object.keys(timings).map((taskName) => {
    let timing = Number.parseFloat(timings[taskName].toFixed(2));
    let relavtive = `${((timings[taskName] * 100) / total).toFixed(1)}%`;
    tableData.push({
      'Task Name': taskName,
      'Time (sec)': timing,
      'Relative: ': relavtive,
    });
  });

  return (
    <>
      <Text>Task Timings</Text>
      <InkTable data={tableData} />
    </>
  );
};
