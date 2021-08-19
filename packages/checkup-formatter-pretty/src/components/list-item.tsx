import * as React from 'react';
import { FC } from 'react';
import { Text, Box } from 'ink';

export const ListItem: FC<{ data: any }> = ({ data }) => {
  return (
    <Box>
      <Text>{data}</Text>
    </Box>
  );
};
