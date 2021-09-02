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
      <Text underline>{formatRuleId(taskResult.rule.id)}</Text>
      <Text>Total: {taskResult.results.length}</Text>
    </Box>
  );
};

function formatRuleId(ruleId: string): string {
  let title = ruleId.replace(/(-.)/g, function (x: string) {
    return ' ' + x[1].toUpperCase();
  });
  return title.charAt(0).toUpperCase() + title.slice(1);
}
