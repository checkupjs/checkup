import * as React from 'react';
import logSymbols from 'log-symbols';
import { CheckupLogParser, FormatterOptions, TaskName } from '@checkup/core';
import { ReportingDescriptor } from 'sarif';
import {
  Box,
  Text,
  MetaData,
  TaskTiming,
  CLIInfo,
  Actions,
  ResultsToFile,
  TaskErrors,
} from '@checkup/ui';

export const Summary: React.FC<{
  logParser: CheckupLogParser;
  options: FormatterOptions;
}> = ({ logParser, options }) => {
  let { actions, executedTasks, log, metaData, timings, tasksWithExceptions } = logParser;

  return (
    <Box flexDirection="column" flexGrow={1} marginTop={1} marginBottom={1}>
      <MetaData metaData={metaData} />
      <TaskResults tasksWithExceptions={tasksWithExceptions} executedTasks={executedTasks} />
      <TaskTiming timings={timings} />
      <TaskErrors hasErrors={tasksWithExceptions.size > 0} />
      <ResultsToFile log={log} options={options} />
      <Actions actions={actions} />
      <CLIInfo metaData={metaData} />
    </Box>
  );
};

const TaskResults: React.FC<{
  executedTasks: ReportingDescriptor[];
  tasksWithExceptions: Set<TaskName>;
}> = ({ executedTasks, tasksWithExceptions }) => {
  return (
    <>
      <Box>
        <Text>Checkup ran the following task(s):</Text>
      </Box>
      <Box marginBottom={1} flexDirection="column">
        {executedTasks
          .map((rule) => rule.id)
          .sort()
          .map((taskName) => {
            return (
              <Text key={taskName}>
                {`${tasksWithExceptions.has(taskName) ? logSymbols.error : logSymbols.success} `}
                {taskName}
              </Text>
            );
          })}
      </Box>
    </>
  );
};

export default Summary;
