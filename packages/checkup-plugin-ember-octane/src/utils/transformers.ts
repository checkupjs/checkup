import { MigrationInfo, MigrationTaskConfig } from '../types';

import { CLIEngine } from 'eslint';
import { TemplateLintReport } from '@checkup/core';

export function transformESLintReport(
  migrationConfig: MigrationTaskConfig,
  report: CLIEngine.LintReport
): MigrationInfo {
  let relatedResults = report.results.filter(({ filePath }) =>
    migrationConfig.fileMatchers.some((fileMatcher) => fileMatcher.test(filePath))
  );

  let { length: totalApplicableFiles } = relatedResults;

  let relatedResultsWithViolations = relatedResults.filter((result) => {
    return result.messages.some(({ ruleId }) =>
      ruleId ? migrationConfig.rules.includes(ruleId) : false
    );
  });

  let resultsWithoutViolations = totalApplicableFiles - relatedResultsWithViolations.length;

  // If we don't have any applicable files, we assume the application is migrated.
  let percentageWithoutViolations =
    totalApplicableFiles === 0 ? 100 : (resultsWithoutViolations / totalApplicableFiles) * 100;

  return {
    completionInfo: {
      total: totalApplicableFiles,
      completed: resultsWithoutViolations,
      percentage: percentageWithoutViolations.toFixed(2),
    },
    name: migrationConfig.name,
    relatedResults,
  };
}

export function transformTemplateLintReport(
  migrationConfig: MigrationTaskConfig,
  report: TemplateLintReport
): MigrationInfo {
  let relatedResults = report.results.filter(({ filePath }) =>
    migrationConfig.fileMatchers.some((fileMatcher) => fileMatcher.test(filePath))
  );

  let relatedResultsWithViolations = relatedResults.filter((result) => {
    return result.messages.some(({ rule }) =>
      rule ? migrationConfig.rules.includes(rule) : false
    );
  });

  let { length: totalApplicableFiles } = relatedResults;

  let resultsWithoutViolations = totalApplicableFiles - relatedResultsWithViolations.length;

  // If we don't have any applicable files, we assume the application is migrated.
  let percentageWithoutViolations =
    totalApplicableFiles === 0 ? 100 : (resultsWithoutViolations / totalApplicableFiles) * 100;

  return {
    completionInfo: {
      total: totalApplicableFiles,
      completed: resultsWithoutViolations,
      percentage: percentageWithoutViolations.toFixed(2),
    },
    name: migrationConfig.name,
    relatedResults,
  };
}
