import React, { FC } from 'react';
import { Box, Text } from 'ink';

export const Table: FC<{ data: any }> = ({ data }) => {
  return (
    <Box>
      <Text>I am a table {data}</Text>
    </Box>
  );
};
