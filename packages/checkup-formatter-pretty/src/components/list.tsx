import * as React from 'react';
import { Box, Text } from 'ink';
import { RuleResults } from '@checkup/core';

/**
 * // TODO: Group result by data field
 * that provided by checkup task
 */
export const List: React.FC<{ taskResult: RuleResults }> = ({ taskResult }) => {
  return (
    <Box flexDirection="column">
      <Text underline>{taskResult.rule.properties?.taskDisplayName}</Text>
      <Text>Total: {taskResult.results.length}</Text>
    </Box>
  );
};
