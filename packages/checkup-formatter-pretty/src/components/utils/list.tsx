import * as React from 'react';
import { Box } from 'ink';

export const List: React.FC = ({ children }) => {
  return <Box flexDirection="column">{children}</Box>;
};
