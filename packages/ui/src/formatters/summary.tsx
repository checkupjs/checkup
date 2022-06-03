import * as React from 'react';
import { Box, Text } from 'ink';
import logSymbols from 'log-symbols';
import { CheckupLogParser, FormatterOptions, RuleResults, TaskName } from '@checkup/core';
import { ReportingDescriptor } from 'sarif';
import { MetaData } from '../components/MetaData.js';
import { TaskTiming } from '../components/TaskTiming.js';
import { CLIInfo } from '../components/CLIInfo.js';
import { Actions } from '../components/Actions.js';
import { ResultsToFile } from '../components/ResultsToFile.js';

export const Summary: React.FC<{
  logParser: CheckupLogParser;
  options: FormatterOptions;
}> = ({ logParser, options }) => {
  let { log, metaData, resultsByRule: taskResults, rules, timings, actions } = logParser;

  return (
    <Box flexDirection="column" marginTop={1} marginBottom={1}>
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

      <Box marginBottom={1}>
        {logParser.executedTasks
          .map((rule) => rule.id)
          .sort()
          .map((taskName) => {
            return (
              <Box flexDirection="column" key={taskName}>
                <Text>
                  {`${logSymbols.success} `}
                  {taskName}
                </Text>
              </Box>
            );
          })}
      </Box>
    </>
  );
};

export default Summary;
