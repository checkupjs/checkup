import * as React from 'react';
import { Box, Text } from 'ink';

export const TaskErrors: React.FC<{ hasErrors: boolean }> = ({ hasErrors }) => {
  if (!hasErrors) {
    return <></>;
  }

  return (
    <Box marginBottom={1}>
      <Text color="red" wrap="end">
        Some tasks ran with errors. Use the "summary" formatter or use the `--output-file` option
        and review the "invocation.toolExecutionNotifications" property in the SARIF log for more
        details.
      </Text>
    </Box>
  );
};
