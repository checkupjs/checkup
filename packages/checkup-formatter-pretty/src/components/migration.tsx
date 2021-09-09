import * as React from 'react';
import { Box, Text } from 'ink';
import { RuleResults } from '@checkup/core';
import { Result } from 'sarif';
import { TaskDisplayName } from '../sub-components/task-display-name';

const startCase = require('lodash.startcase');

export const Migration: React.FC<{ taskResult: RuleResults }> = ({ taskResult }) => {
  let featureStatus = buildMigrationData(taskResult);
  let outstandingFeatureCount = taskResult.results.length;

  return (
    <>
      <TaskDisplayName taskResult={taskResult} />
      <Text>Outstanding features to be migrated: {outstandingFeatureCount}</Text>
      <Box marginLeft={2} flexDirection="column">
        {[...featureStatus].map(([feature, count]) => {
          return (
            <Text key={feature}>
              {startCase(feature)} {count}
            </Text>
          );
        })}
      </Box>
    </>
  );
};

function buildMigrationData(taskResult: RuleResults) {
  return taskResult.results.reduce((features: Map<string, number>, result: Result) => {
    let feature = result.properties?.migration.feature;

    features.set(feature, (features.get(feature) ?? 0) + 1);

    return features;
  }, new Map<string, number>());
}
