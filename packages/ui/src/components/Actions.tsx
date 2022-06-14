import * as React from 'react';
import { Box, Text } from 'ink';
import chalk from 'chalk';
import { Notification } from 'sarif';

export const Actions: React.FC<{ actions: Notification[] }> = ({ actions }) => {
  if (!actions || actions.length === 0) {
    return <></>;
  }

  return (
    <Box>
      {actions.map((action: Notification) => {
        return (
          <Text>
            {chalk.yellow('■')} {action.message.text}
          </Text>
        );
      })}
    </Box>
  );
};
