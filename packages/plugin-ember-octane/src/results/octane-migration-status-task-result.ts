import { CLIEngine } from 'eslint';
import { TaskResult, ui } from '@checkup/core';

// classic-decorator-hooks                  -
// classic-decorator-no-classic-methods     -
// no-actions-hash                          -
// no-classic-classes                       -
// no-classic-components                    -
// no-component-lifecycle-hooks             -
// no-computed-properties-in-native-classes -
// no-get-with-default                      -
// no-get                                   -
// no-jquery                                -
// require-tagless-components               -

interface CompetionInfo {
  total: number;
  completed: number;
  percentage: string;
}
interface MigrationInfo {
  completionInfo: CompetionInfo;
  name: string;
  relatedResults: CLIEngine.LintResult[];
}

interface MigrationRuleConfig {
  fileMatchers: RegExp[];
  name: string;
  rules: string[];
}

export enum MigrationType {
  NativeClasses = 'native-classes',
  TaglessComponents = 'tagless-components',
  GlimmerComponents = 'glimmer-components',
  TrackedProperties = 'tracked-properties',
}

const MIGRATION_RULE_CONFIGS: { [Key in MigrationType]: MigrationRuleConfig } = {
  [MigrationType.NativeClasses]: {
    fileMatchers: [
      /app\/app\.js$/,
      /(app|addon)\/(adapters|components|controllers|helpers|models|routes|services)\/.*\.js$/,
    ],
    name: 'Native Class Migration',
    rules: [
      'ember/no-classic-classes',
      'ember/classic-decorator-no-classic-methods',
      'ember/no-actions-hash',
      'ember/no-get',
    ],
  },
  [MigrationType.TaglessComponents]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Tagless Component Migration',
    rules: ['ember/require-tagless-components'],
  },
  [MigrationType.GlimmerComponents]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Glimmer Component Migration',
    rules: ['ember/no-classic-components'],
  },
  [MigrationType.TrackedProperties]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Tracked Properties Migration',
    rules: ['ember/no-computed-properties-in-native-classes'],
  },
};

const getMigrationInfo = (
  migrationConfig: MigrationRuleConfig,
  report: CLIEngine.LintReport
): MigrationInfo => {
  // Get all files the rule applies to.
  let relatedResults = report.results.filter(({ filePath }) =>
    migrationConfig.fileMatchers.some(fileMatcher => fileMatcher.test(filePath))
  );

  let { length: totalApplicableFiles } = relatedResults;

  // Get all results that contain associated violations
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
};

export default class OctaneMigrationStatusTaskResult implements TaskResult {
  taskName: string = 'Octane Migration Status';

  constructor(public report: CLIEngine.LintReport) {}

  toConsole() {
    ui.styledHeader(this.taskName);
    ui.blankLine();
    ui.styledObject({
      'JS Error Count': this.report.errorCount,
    });
    ui.blankLine();
  }

  toJson() {
    let nativeClassMigrationInfo = getMigrationInfo(
      MIGRATION_RULE_CONFIGS[MigrationType.NativeClasses],
      this.report
    );

    let taglessComponentMigrationInfo = getMigrationInfo(
      MIGRATION_RULE_CONFIGS[MigrationType.TaglessComponents],
      this.report
    );

    let glimmerComponentsMigrationinfo = getMigrationInfo(
      MIGRATION_RULE_CONFIGS[MigrationType.GlimmerComponents],
      this.report
    );

    return {
      totalViolations: this.report.errorCount,
      migrationTasks: {
        [MigrationType.NativeClasses]: nativeClassMigrationInfo,
        [MigrationType.TaglessComponents]: taglessComponentMigrationInfo,
        [MigrationType.GlimmerComponents]: glimmerComponentsMigrationinfo,
      },
    };
  }
}
