import {
  BaseTaskResult,
  ESLintReport,
  TaskMetaData,
  TaskResult,
  TemplateLintReport,
  ui,
  TaskConfig,
} from '@checkup/core';
import {
  ESLINT_MIGRATION_TASK_CONFIGS,
  TEMPLATE_LINT_MIGRATION_TASK_CONFIGS,
} from '../utils/task-configs';
import { ESLintMigrationType, MigrationInfo, TemplateLintMigrationType } from '../types';
import { transformESLintReport, transformTemplateLintReport } from '../utils/transformers';

export default class OctaneMigrationStatusTaskResult extends BaseTaskResult implements TaskResult {
  migrationResults: MigrationInfo[];
  totalViolations: number;

  constructor(
    meta: TaskMetaData,
    config: TaskConfig,
    public esLintReport: ESLintReport,
    public templateLintReport: TemplateLintReport
  ) {
    super(meta, config);
    this.migrationResults = this.formattedMigrationResults;
    this.totalViolations = this.esLintReport.errorCount + this.templateLintReport.errorCount;
  }

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.log(`${ui.emphasize('Octane Violations')}: ${this.totalViolations}`);
      ui.blankLine();
      this.migrationResults.forEach((migrationResult) => {
        ui.bar(
          migrationResult.name,
          Number.parseInt(migrationResult.completionInfo.percentage),
          100,
          '%'
        );
      });
    });
  }

  toJson() {
    return {
      meta: this.meta,
      result: {
        totalViolations: this.esLintReport.errorCount + this.templateLintReport.errorCount,
        migrationTaskResults: this.migrationResults,
      },
    };
  }

  get formattedMigrationResults() {
    let eslintMigrationTasks: ESLintMigrationType[] = [
      ESLintMigrationType.NativeClasses,
      ESLintMigrationType.TaglessComponents,
      ESLintMigrationType.GlimmerComponents,
      ESLintMigrationType.TrackedProperties,
      ESLintMigrationType.Mixins,
    ];
    let templateLintMigrationTasks: TemplateLintMigrationType[] = [
      TemplateLintMigrationType.AngleBrackets,
      TemplateLintMigrationType.NamedArgs,
      TemplateLintMigrationType.OwnProperties,
      TemplateLintMigrationType.UseModifiers,
    ];

    let eslintMigrationResults = eslintMigrationTasks.map((eslintMigrationTask) =>
      transformESLintReport(ESLINT_MIGRATION_TASK_CONFIGS[eslintMigrationTask], this.esLintReport)
    );

    let templateLintMigrationResults = templateLintMigrationTasks.map((templateMigrationTask) =>
      transformTemplateLintReport(
        TEMPLATE_LINT_MIGRATION_TASK_CONFIGS[templateMigrationTask],
        this.templateLintReport
      )
    );
    return [...eslintMigrationResults, ...templateLintMigrationResults];
  }
}
