import * as React from 'react';
import { Box, Text } from 'ink';
import { RuleResults } from '@checkup/core';
import { Result } from 'sarif';
import { TaskDisplayName } from '../sub-components/task-display-name';
import { getOptions } from '../get-options';
import { getSorter, SortBy, SortDirection } from '../get-sorter';

type MigrationOptions = {
  sortBy: SortBy;
  sortDirection: SortDirection;
};

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
              {feature} {count}
            </Text>
          );
        })}
      </Box>
    </>
  );
};

function buildMigrationData(taskResult: RuleResults) {
  const features = taskResult.rule.properties?.features || [];
  const { rule, results } = taskResult;
  const options = getOptions<MigrationOptions>(rule);

  let aggregatedFeatureResults = results.reduce((features: Map<string, number>, result: Result) => {
    // Tasks inheriting from BaseMigrationTask use featureName for their migration property key. Generic BaseTasks do not.
    let feature = result.properties?.migration.featureName ?? result.properties?.migration.feature;

    features.set(feature, (features.get(feature) ?? 0) + 1);

    return features;
  }, new Map<string, number>());

  // Any feature that doesn't have results associated with it should indicate that
  // it's complete, or has no outstanding work.
  for (let feature of features) {
    if (!aggregatedFeatureResults.get(feature)) {
      aggregatedFeatureResults.set(feature, 0);
    }
  }

  if (options.sortBy) {
    let sort = getSorter(options.sortBy);

    aggregatedFeatureResults = sort(aggregatedFeatureResults, options.sortDirection);
  }

  return aggregatedFeatureResults;
}
