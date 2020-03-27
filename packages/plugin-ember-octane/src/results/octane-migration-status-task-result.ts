import { CLIEngine } from 'eslint';
import { BaseTaskResult, TaskMetaData, TaskResult, ui } from '@checkup/core';
import { ESLintMigrationType, MigrationInfo, TemplateLintMigrationType } from '../types';
import { TemplateLintReport } from '../types/ember-template-lint';
import { transformESLintReport, transformTemplateLintReport } from '../utils/transformers';
import {
  ESLINT_MIGRATION_TASK_CONFIGS,
  TEMPLATE_LINT_MIGRATION_TASK_CONFIGS,
} from '../utils/task-configs';

export default class OctaneMigrationStatusTaskResult extends BaseTaskResult implements TaskResult {
  taskName: string = 'Octane Migration Status';

  constructor(
    meta: TaskMetaData,
    public esLintReport: CLIEngine.LintReport,
    public templateLintReport: TemplateLintReport
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
    let nativeClassMigrationInfo = transformESLintReport(
      ESLINT_MIGRATION_TASK_CONFIGS[ESLintMigrationType.NativeClasses],
      this.esLintReport
    );

    let taglessComponentMigrationInfo = transformESLintReport(
      ESLINT_MIGRATION_TASK_CONFIGS[ESLintMigrationType.TaglessComponents],
      this.esLintReport
    );

    let glimmerComponentsMigrationinfo = transformESLintReport(
      ESLINT_MIGRATION_TASK_CONFIGS[ESLintMigrationType.GlimmerComponents],
      this.esLintReport
    );

    let trackedPropertiesMigrationInfo = transformESLintReport(
      ESLINT_MIGRATION_TASK_CONFIGS[ESLintMigrationType.TrackedProperties],
      this.esLintReport
    );

    let angleBracketsMigrationInfo = transformTemplateLintReport(
      TEMPLATE_LINT_MIGRATION_TASK_CONFIGS[TemplateLintMigrationType.AngleBrackets],
      this.templateLintReport
    );

    let namedArgsMigrationInfo = transformTemplateLintReport(
      TEMPLATE_LINT_MIGRATION_TASK_CONFIGS[TemplateLintMigrationType.NamedArgs],
      this.templateLintReport
    );

    let ownPropsMigrationInfo = transformTemplateLintReport(
      TEMPLATE_LINT_MIGRATION_TASK_CONFIGS[TemplateLintMigrationType.OwnProperties],
      this.templateLintReport
    );

    let useModifiersMigrationInfo = transformTemplateLintReport(
      TEMPLATE_LINT_MIGRATION_TASK_CONFIGS[TemplateLintMigrationType.UseModifiers],
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
