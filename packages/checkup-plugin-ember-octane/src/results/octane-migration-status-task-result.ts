import { BaseTaskResult, ESLintReport, TaskResult, TemplateLintReport, ui } from '@checkup/core';
import {
  ESLINT_MIGRATION_TASK_CONFIGS,
  TEMPLATE_LINT_MIGRATION_TASK_CONFIGS,
} from '../utils/task-configs';
import { ESLintMigrationType, MigrationInfo, TemplateLintMigrationType } from '../types';
import { transformESLintReport, transformTemplateLintReport } from '../utils/transformers';

export default class OctaneMigrationStatusTaskResult extends BaseTaskResult implements TaskResult {
  data!: {
    migrationResults: MigrationInfo[];
    totalViolations: number;
    esLintReport: ESLintReport;
    templateLintReport: TemplateLintReport;
  };

  process(data: { esLintReport: ESLintReport; templateLintReport: TemplateLintReport }) {
    this.data = { ...{ migrationResults: [], totalViolations: 0 }, ...data };

    this.formatMigrationResults();

    this.data.totalViolations =
      this.data.esLintReport.errorCount + this.data.templateLintReport.errorCount;
  }

  toConsole() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.log(`${ui.emphasize('Octane Violations')}: ${this.data.totalViolations}`);
      ui.blankLine();
      this.data.migrationResults.forEach((migrationResult) => {
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
        totalViolations:
          this.data.esLintReport.errorCount + this.data.templateLintReport.errorCount,
        migrationTaskResults: this.data.migrationResults,
      },
    };
  }

  formatMigrationResults() {
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
      transformESLintReport(
        ESLINT_MIGRATION_TASK_CONFIGS[eslintMigrationTask],
        this.data.esLintReport
      )
    );

    let templateLintMigrationResults = templateLintMigrationTasks.map((templateMigrationTask) =>
      transformTemplateLintReport(
        TEMPLATE_LINT_MIGRATION_TASK_CONFIGS[templateMigrationTask],
        this.data.templateLintReport
      )
    );
    this.data.migrationResults = [...eslintMigrationResults, ...templateLintMigrationResults];
  }
}
