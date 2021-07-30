import React, { FC } from 'react';
import { Box } from 'ink';

export const List: FC = ({ children }) => {
  return <Box flexDirection="column">{children}</Box>;
};
