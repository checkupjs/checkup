import { CLIEngine } from 'eslint';
import { MigrationInfo, MigrationTaskConfig } from '../types';
import { TemplateLintReport } from '../types/ember-template-lint';

export function transformESLintReport(
  migrationConfig: MigrationTaskConfig,
  report: CLIEngine.LintReport
): MigrationInfo {
  let relatedResults = report.results.filter(({ filePath }) =>
    migrationConfig.fileMatchers.some(fileMatcher => fileMatcher.test(filePath))
  );

  let { length: totalApplicableFiles } = relatedResults;

  let relatedResultsWithViolations = relatedResults.filter(result => {
    return result.messages.some(({ ruleId }) =>
      ruleId ? migrationConfig.rules.includes(ruleId) : false
    );
  });

  let resultsWithoutViolations = totalApplicableFiles - relatedResultsWithViolations.length;
  let percentageWithoutViolations = (resultsWithoutViolations / totalApplicableFiles) * 100;

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
    migrationConfig.fileMatchers.some(fileMatcher => fileMatcher.test(filePath))
  );

  let relatedResultsWithViolations = relatedResults.filter(result => {
    return result.messages.some(({ rule }) =>
      rule ? migrationConfig.rules.includes(rule) : false
    );
  });

  let { length: totalApplicableFiles } = relatedResults;

  let resultsWithoutViolations = totalApplicableFiles - relatedResultsWithViolations.length;
  let percentageWithoutViolations = (resultsWithoutViolations / totalApplicableFiles) * 100;

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
