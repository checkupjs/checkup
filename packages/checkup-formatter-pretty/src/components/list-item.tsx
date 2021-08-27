import * as React from 'react';
import { Text, Box } from 'ink';

export const ListItem: React.FC<{ data: any }> = ({ data }) => {
  return (
    <Box>
      <Text>{data}</Text>
    </Box>
  );
};
