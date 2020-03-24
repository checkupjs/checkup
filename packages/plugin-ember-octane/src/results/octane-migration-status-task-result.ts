import { CLIEngine } from 'eslint';
import { BaseTaskResult, TaskMetaData, TaskResult, ui } from '@checkup/core';
import {
  EmberTemplateLintReport,
  ESLintMigrationType,
  MigrationInfo,
  MigrationRuleConfig,
  TemplateLintMigrationType,
} from '../types';

const ESLINT_MIGRATION_RULE_CONFIGS: { [Key in ESLintMigrationType]: MigrationRuleConfig } = {
  [ESLintMigrationType.NativeClasses]: {
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
  [ESLintMigrationType.TaglessComponents]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Tagless Component',
    rules: ['ember/require-tagless-components'],
  },
  [ESLintMigrationType.GlimmerComponents]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Glimmer Component',
    rules: ['ember/no-classic-components'],
  },
  [ESLintMigrationType.TrackedProperties]: {
    fileMatchers: [/(app|addon)\/components\/.*\.js$/],
    name: 'Tracked Properties',
    rules: ['ember/no-computed-properties-in-native-classes'],
  },
};

const TEMPLATE_LINT_MIGRATION_RULE_CONFIGS: {
  [Key in TemplateLintMigrationType]: MigrationRuleConfig;
} = {
  [TemplateLintMigrationType.AngleBrackets]: {
    fileMatchers: [/(addon|app)\/.*\.hbs$/],
    name: 'Angle Brackets',
    rules: ['no-curly-component-invocation'],
  },
  [TemplateLintMigrationType.NamedArgs]: {
    fileMatchers: [/(addon|app)\/.*\.hbs$/],
    name: 'Use Named Arguments',
    rules: ['no-args-paths'],
  },
  [TemplateLintMigrationType.OwnProperties]: {
    fileMatchers: [/(addon|app)\/.*\.hbs$/],
    name: 'Own Properties',
    rules: ['no-implicit-this'],
  },
  [TemplateLintMigrationType.UseModifiers]: {
    fileMatchers: [/(addon|app)\/.*\.hbs$/],
    name: 'Use Modifiers',
    rules: ['no-action'],
  },
};

function getESLintMigrationInfo(
  migrationConfig: MigrationRuleConfig,
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

function getTemplateLintMigrationInfo(
  migrationConfig: MigrationRuleConfig,
  report: EmberTemplateLintReport
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
    let { esLint: esLintResults, templateLint: templateLintResults } = jsonOutput.result;

    let migrationTasks = [
      esLintResults.migrationTasks[ESLintMigrationType.NativeClasses],
      esLintResults.migrationTasks[ESLintMigrationType.TaglessComponents],
      esLintResults.migrationTasks[ESLintMigrationType.GlimmerComponents],
      esLintResults.migrationTasks[ESLintMigrationType.TrackedProperties],
      templateLintResults.migrationTasks[TemplateLintMigrationType.AngleBrackets],
      templateLintResults.migrationTasks[TemplateLintMigrationType.NamedArgs],
      templateLintResults.migrationTasks[TemplateLintMigrationType.OwnProperties],
      templateLintResults.migrationTasks[TemplateLintMigrationType.UseModifiers],
    ];

    ui.styledHeader(this.taskName);
    ui.blankLine();
    ui.styledObject({
      'JavaScript Octane Violations': esLintResults.totalViolations,
      'Handlebars Octane Violations': templateLintResults.totalViolations,
    });
    ui.blankLine();
    ui.table(migrationTasks, {
      name: { header: 'Migration Task' },
      completion: {
        header: 'Completion Percentage',
        get: (row: MigrationInfo) => `${row.completionInfo.percentage}%`,
      },
    });
    ui.blankLine();
  }

  json() {
    let nativeClassMigrationInfo = getESLintMigrationInfo(
      ESLINT_MIGRATION_RULE_CONFIGS[ESLintMigrationType.NativeClasses],
      this.esLintReport
    );

    let taglessComponentMigrationInfo = getESLintMigrationInfo(
      ESLINT_MIGRATION_RULE_CONFIGS[ESLintMigrationType.TaglessComponents],
      this.esLintReport
    );

    let glimmerComponentsMigrationinfo = getESLintMigrationInfo(
      ESLINT_MIGRATION_RULE_CONFIGS[ESLintMigrationType.GlimmerComponents],
      this.esLintReport
    );

    let trackedPropertiesMigrationInfo = getESLintMigrationInfo(
      ESLINT_MIGRATION_RULE_CONFIGS[ESLintMigrationType.TrackedProperties],
      this.esLintReport
    );

    let angleBracketsMigrationInfo = getTemplateLintMigrationInfo(
      TEMPLATE_LINT_MIGRATION_RULE_CONFIGS[TemplateLintMigrationType.AngleBrackets],
      this.templateLintReport
    );

    let namedArgsMigrationInfo = getTemplateLintMigrationInfo(
      TEMPLATE_LINT_MIGRATION_RULE_CONFIGS[TemplateLintMigrationType.NamedArgs],
      this.templateLintReport
    );

    let ownPropsMigrationInfo = getTemplateLintMigrationInfo(
      TEMPLATE_LINT_MIGRATION_RULE_CONFIGS[TemplateLintMigrationType.OwnProperties],
      this.templateLintReport
    );

    let useModifiersMigrationInfo = getTemplateLintMigrationInfo(
      TEMPLATE_LINT_MIGRATION_RULE_CONFIGS[TemplateLintMigrationType.UseModifiers],
      this.templateLintReport
    );

    return {
      meta: this.meta,
      result: {
        esLint: {
          totalViolations: this.esLintReport.errorCount,
          migrationTasks: {
            [ESLintMigrationType.NativeClasses]: nativeClassMigrationInfo,
            [ESLintMigrationType.TaglessComponents]: taglessComponentMigrationInfo,
            [ESLintMigrationType.GlimmerComponents]: glimmerComponentsMigrationinfo,
            [ESLintMigrationType.TrackedProperties]: trackedPropertiesMigrationInfo,
          },
        },
        templateLint: {
          totalViolations: this.templateLintReport.errorCount,
          migrationTasks: {
            [TemplateLintMigrationType.AngleBrackets]: angleBracketsMigrationInfo,
            [TemplateLintMigrationType.NamedArgs]: namedArgsMigrationInfo,
            [TemplateLintMigrationType.OwnProperties]: ownPropsMigrationInfo,
            [TemplateLintMigrationType.UseModifiers]: useModifiersMigrationInfo,
          },
        },
      },
    };
  }

  pdf() {
    return undefined;
  }
}
