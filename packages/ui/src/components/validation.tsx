import * as React from 'react';
import { Box, Text } from 'ink';
import { RuleResults } from '@checkup/core';
import { Result } from 'sarif';
import logSymbols from 'log-symbols';
import { TaskDisplayName } from '../sub-components/task-display-name.js';

export const Validation: React.FC<{ taskResult: RuleResults }> = ({ taskResult }) => {
  let isValid = taskResult.results.every((result) => result.kind === 'pass');

  return (
    <>
      <TaskDisplayName taskResult={taskResult} />
      <Text>Validation {isValid ? 'passed' : 'failed'}</Text>
      <Box marginLeft={2} flexDirection="column">
        {[...taskResult.results].map((result) => {
          return <ValidationStepItem key={result.message.text} result={result} />;
        })}
      </Box>
    </>
  );
};

const ValidationStepItem: React.FC<{ result: Result }> = ({ result }) => {
  let { message, kind } = result;

  return (
    <Text>
      {kind === 'pass' ? logSymbols.success : logSymbols.error} {message.text}
    </Text>
  );
};
