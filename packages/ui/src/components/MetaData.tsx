import * as React from 'react';
import { CheckupMetadata } from '@checkup/core';
import { Box, Text } from 'ink';

export const MetaData: React.FC<{ metaData: CheckupMetadata }> = ({ metaData }) => {
  let { analyzedFilesCount, project } = metaData;
  let { name, version, repository } = project;
  let analyzedFilesMessage =
    repository.totalFiles !== analyzedFilesCount ? `(${analyzedFilesCount} files analyzed)` : '';

  return (
    <>
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text>
            Checkup report generated for {name} v{version} {analyzedFilesMessage}
          </Text>
        </Box>
        <Box marginBottom={1}>
          <Text>
            This project is {repository.age} old, with {repository.activeDays} active days,{' '}
            {repository.totalCommits} commits and {repository.totalFiles} files
          </Text>
        </Box>
      </Box>
    </>
  );
};
