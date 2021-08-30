import * as React from 'react';
import { Text } from 'ink';
import { RuleResults } from '@checkup/core';

export const TaskResultList: React.FC<{ taskResult: RuleResults }> = ({ taskResult }) => {
  return (
    <Text>
      ruleId: {taskResult.rule.id} result(value): {taskResult.results.length}
    </Text>
  );
};
