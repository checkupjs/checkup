import { CLIEngine } from 'eslint';
import { BaseTaskResult, TaskMetaData, TaskResult, ui } from '@checkup/core';
import { EmberTemplateLintReport } from '../tasks/octane-migration-status-task';

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
    name: 'Native Class',
    rules: [
      'ember/no-classic-classes',
      'ember/classic-decorator-no-classic-methods',
      'ember/no-actions-hash',
      'ember/no-get',
    ],
  },
  [MigrationType.TaglessComponents]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Tagless Component',
    rules: ['ember/require-tagless-components'],
  },
  [MigrationType.GlimmerComponents]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Glimmer Component',
    rules: ['ember/no-classic-components'],
  },
  [MigrationType.TrackedProperties]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Tracked Properties',
    rules: ['ember/no-computed-properties-in-native-classes'],
  },
};

function getMigrationInfo(
  migrationConfig: MigrationRuleConfig,
  report: CLIEngine.LintReport
): MigrationInfo {
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
}

export default class OctaneMigrationStatusTaskResult extends BaseTaskResult implements TaskResult {
  taskName: string = 'Octane Migration Status';

  constructor(
    meta: TaskMetaData,
    public esLintReport: CLIEngine.LintReport,
    public templateLintReport: EmberTemplateLintReport
  ) {
    super(meta);
  }

  stdout() {
    let jsonOutput = this.json();
    let { esLint: esLintResults } = jsonOutput.result;

    let esLintmigrationTasks = [
      esLintResults.migrationTasks[MigrationType.NativeClasses],
      esLintResults.migrationTasks[MigrationType.TaglessComponents],
      esLintResults.migrationTasks[MigrationType.GlimmerComponents],
      esLintResults.migrationTasks[MigrationType.TrackedProperties],
    ];

    ui.styledHeader(this.taskName);
    ui.blankLine();
    ui.styledObject({
      'JavaScript Octane Violations': esLintResults.totalViolations,
      'Handlebars Octane Violations': 0,
    });
    ui.blankLine();
    ui.table(esLintmigrationTasks, {
      name: { header: 'Migration Task' },
      completion: {
        header: 'Completion Percentage',
        get: (row: MigrationInfo) => `${row.completionInfo.percentage}%`,
      },
    });
    ui.blankLine();
  }

  json() {
    let nativeClassMigrationInfo = getMigrationInfo(
      MIGRATION_RULE_CONFIGS[MigrationType.NativeClasses],
      this.esLintReport
    );

    let taglessComponentMigrationInfo = getMigrationInfo(
      MIGRATION_RULE_CONFIGS[MigrationType.TaglessComponents],
      this.esLintReport
    );

    let glimmerComponentsMigrationinfo = getMigrationInfo(
      MIGRATION_RULE_CONFIGS[MigrationType.GlimmerComponents],
      this.esLintReport
    );

    let trackedPropertiesMigrationInfo = getMigrationInfo(
      MIGRATION_RULE_CONFIGS[MigrationType.TrackedProperties],
      this.esLintReport
    );

    return {
      meta: this.meta,
      result: {
        esLint: {
          totalViolations: this.esLintReport.errorCount,
          migrationTasks: {
            [MigrationType.NativeClasses]: nativeClassMigrationInfo,
            [MigrationType.TaglessComponents]: taglessComponentMigrationInfo,
            [MigrationType.GlimmerComponents]: glimmerComponentsMigrationinfo,
            [MigrationType.TrackedProperties]: trackedPropertiesMigrationInfo,
          },
        },
        templateLint: {
          totalViolations: this.templateLintReport.errorCount,
        },
      },
    };
  }

  pdf() {
    return undefined;
  }
}
