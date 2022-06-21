import * as React from 'react';
import { Box, Text } from 'ink';
import { Log } from 'sarif';
import { FormatterOptions, writeResultsToFile } from '@checkup/core';

export const ResultsToFile: React.FC<{ log: Log; options: FormatterOptions }> = ({
  log,
  options,
}) => {
  let shouldWrite = process.env.VITEST === undefined;
  let resultsFilePath = writeResultsToFile(log, options.cwd, options.outputFile, shouldWrite);

  return (
    <Box flexDirection="column" flexGrow={1} marginBottom={1}>
      <Box>
        <Text>Results have been saved to the following file:</Text>
      </Box>
      <Box>
        <Text color="yellow" wrap="end">
          {resultsFilePath}
        </Text>
      </Box>
    </Box>
  );
};
