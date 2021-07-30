import React, { FC } from 'react';
import { Text, Box } from 'ink';
import { ScalarDict } from '../types/components';

export const ListItem: FC<{ data: ScalarDict }> = ({ data }) => {
  return (
    <Box flexDirection="column">
      <Text color="green">{data}</Text>
    </Box>
  );
};
