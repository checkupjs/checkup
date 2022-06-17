import * as React from 'react';
import logSymbols from 'log-symbols';
import { CheckupLogParser, FormatterOptions, RuleResults, TaskName } from '@checkup/core';
import { ReportingDescriptor } from 'sarif';
import { Box, Text, MetaData, TaskTiming, CLIInfo, Actions, ResultsToFile } from '@checkup/ui';

export const Summary: React.FC<{
  logParser: CheckupLogParser;
  options: FormatterOptions;
}> = ({ logParser, options }) => {
  let { log, metaData, resultsByRule: taskResults, rules, timings, actions } = logParser;

  return (
    <Box flexDirection="column" flexGrow={1} marginTop={1} marginBottom={1}>
      <MetaData metaData={metaData} />
      <TaskResults taskResults={taskResults} rules={rules} logParser={logParser} />
      <TaskTiming timings={timings} />
      <ResultsToFile log={log} options={options} />
      <Actions actions={actions} />
      <CLIInfo metaData={metaData} />
    </Box>
  );
};

const TaskResults: React.FC<{
  taskResults: Map<TaskName, RuleResults> | undefined;
  rules: ReportingDescriptor[];
  logParser: CheckupLogParser;
}> = ({ logParser }) => {
  return (
    <>
      <Box>
        <Text>Checkup ran the following task(s) successfully:</Text>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        {logParser.executedTasks
          .map((rule) => rule.id)
          .sort()
          .map((taskName) => {
            return (
              <Text key={taskName}>
                {`${logSymbols.success} `}
                {taskName}
              </Text>
            );
          })}
      </Box>
    </>
  );
};

export default Summary;
