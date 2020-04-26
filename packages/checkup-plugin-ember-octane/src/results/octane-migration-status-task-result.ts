import {
  BaseTaskResult,
  ESLintReport,
  PieChartData,
  TaskMetaData,
  TaskResult,
  TemplateLintReport,
  ui,
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
    public esLintReport: ESLintReport,
    public templateLintReport: TemplateLintReport
  ) {
    super(meta);
    this.migrationResults = this.formattedMigrationResults;
    this.totalViolations = this.esLintReport.errorCount + this.templateLintReport.errorCount;
  }

  stdout() {
    ui.section(this.meta.friendlyTaskName, () => {
      ui.log(`${ui.emphasize('Octane Violations')}: ${this.totalViolations}`);
      ui.blankLine();
      ui.table(this.migrationResults, {
        name: { header: 'Octane Feature' },
        completion: {
          header: 'Completion',
          get: (row: MigrationInfo) => `${row.completionInfo.percentage}%`,
        },
      });
    });
  }

  json() {
    return {
      meta: this.meta,
      result: {
        totalViolations: this.esLintReport.errorCount + this.templateLintReport.errorCount,
        migrationTaskResults: this.migrationResults,
      },
    };
  }

  html() {
    return this.migrationResults
      .map((migrationResult) => this._createPieChartData(migrationResult))
      .filter(Boolean) as PieChartData[];
  }

  _createPieChartData(migrationResult: MigrationInfo): PieChartData | undefined {
    if (Object.keys(migrationResult).length === 0) {
      return;
    }

    return new PieChartData(
      this.meta,
      [
        { value: migrationResult.completionInfo.completed, description: 'migrated' },
        {
          value: migrationResult.completionInfo.total - migrationResult.completionInfo.completed,
          description: 'unmigrated',
        },
      ],
      migrationResult.name
    );
  }

  get formattedMigrationResults() {
    let eslintMigrationTasks: ESLintMigrationType[] = [
      ESLintMigrationType.NativeClasses,
      ESLintMigrationType.TaglessComponents,
      ESLintMigrationType.GlimmerComponents,
      ESLintMigrationType.TrackedProperties,
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
