import * as React from 'react';
import { CheckupMetadata } from '@checkup/core';
import { Box, Text } from 'ink';

export const CLIInfo: React.FC<{ metaData: CheckupMetadata }> = ({ metaData }) => {
  let { version, configHash } = metaData.cli;

  return (
    <Box flexDirection="column">
      <Text color={'grey'}>checkup v{version}</Text>
      <Text color={'grey'}>config {configHash}</Text>
    </Box>
  );
};
