import { transformESLintReport, transformTemplateLintReport } from '../../src/utils/transformers';
import { CLIEngine } from 'eslint';
import { MigrationTaskConfig } from '../../src/types';
import { TemplateLintReport } from '../../src/types/ember-template-lint';

describe('octane-migration-status-task-result', () => {
  describe('ESLint Transformer', () => {
    let bareBonesReport: CLIEngine.LintReport;

    beforeEach(() => {
      bareBonesReport = require('../__fixtures__/non-migrated-barebones-eslint-report.json');
    });

    test('it should report 0% complete for a task with no migrated files', () => {
      let migrationTaskConfig: MigrationTaskConfig = {
        fileMatchers: [
          /app\/(app|router)\.js$/,
          /(app|addon)\/(adapters|components|controllers|helpers|models|routes|services)\/.*\.js$/,
        ],
        name: 'Native Class',
        rules: ['ember/no-classic-classes'],
      };

      let migrationInfo = transformESLintReport(migrationTaskConfig, bareBonesReport);

      expect(migrationInfo.completionInfo.completed).toBe(0);
      expect(migrationInfo.completionInfo.total).toBe(2);
      expect(migrationInfo.completionInfo.percentage).toBe('0.00');
    });

    // TODO
    // test('it should report 100% complete for a fully migrated task', () => {});

    test('it should report 100% for tasks that do not have related files', () => {
      let migrationTaskConfig: MigrationTaskConfig = {
        fileMatchers: [/(app|addon)\/components\/.*\.js$/],
        name: 'Glimmer Component',
        rules: ['ember/no-classic-components'],
      };

      let migrationInfo = transformESLintReport(migrationTaskConfig, bareBonesReport);

      expect(migrationInfo.completionInfo.completed).toBe(0);
      expect(migrationInfo.completionInfo.total).toBe(0);
      expect(migrationInfo.completionInfo.percentage).toBe('100.00');
    });
  });

  describe('Template Lint Transformer', () => {
    let bareBonesReport: TemplateLintReport;

    beforeEach(() => {
      bareBonesReport = require('../__fixtures__/non-migrated-barebones-template-lint-report.json');
    });

    test('it should report 0% complete for a task with no migrated files', () => {
      let migrationTaskConfig = {
        fileMatchers: [/(addon|app)\/.*\.hbs$/],
        name: 'Angle Brackets',
        rules: ['no-curly-component-invocation'],
      };

      let migrationInfo = transformTemplateLintReport(migrationTaskConfig, bareBonesReport);

      expect(migrationInfo.completionInfo.completed).toBe(0);
      expect(migrationInfo.completionInfo.total).toBe(1);
      expect(migrationInfo.completionInfo.percentage).toBe('0.00');
    });

    test('it should report 100% complete for a fully migrated task', () => {
      let migrationTaskConfig = {
        fileMatchers: [/(addon|app)\/.*\.hbs$/],
        name: 'Use Modifiers',
        rules: ['no-action'],
      };

      let migrationInfo = transformTemplateLintReport(migrationTaskConfig, bareBonesReport);

      expect(migrationInfo.completionInfo.completed).toBe(1);
      expect(migrationInfo.completionInfo.total).toBe(1);
      expect(migrationInfo.completionInfo.percentage).toBe('100.00');
    });

    test('it should report 100% for tasks that do not have related files', () => {
      let migrationTaskConfig: MigrationTaskConfig = {
        fileMatchers: [/(addon|app)\/some-rando-dir\/.*\.hbs$/],
        name: 'Own Properties',
        rules: ['no-implicit-this'],
      };

      let migrationInfo = transformTemplateLintReport(migrationTaskConfig, bareBonesReport);

      expect(migrationInfo.completionInfo.completed).toBe(0);
      expect(migrationInfo.completionInfo.total).toBe(0);
      expect(migrationInfo.completionInfo.percentage).toBe('100.00');
    });
  });
});
