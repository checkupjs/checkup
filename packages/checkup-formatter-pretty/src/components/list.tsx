import React, { FC } from 'react';
import { Box, Text } from 'ink';

export const List: FC<{ data: any }> = ({ data }) => {
  return (
    <Box>
      <Text>I am a list {data}</Text>
    </Box>
  );
};
