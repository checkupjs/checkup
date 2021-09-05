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
      {taskResult.rule.properties?.component.data.map((item: any) => {
        return (
          <Text key={item.title}>
            {item.title} {item.value}
          </Text>
        );
      })}
    </Box>
  );
};
