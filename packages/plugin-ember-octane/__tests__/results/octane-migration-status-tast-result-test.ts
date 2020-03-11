import { MigrationType } from '../../src/results/octane-migration-status-task-result';
import { OctaneMigrationStatusTask } from '../../src/tasks';
import { OctaneMigrationStatusTaskResult } from '../../src/results';
import { stdout } from '@checkup/test-helpers';

describe('octane-migration-status-task-result', () => {
  describe('console output', () => {
    test('simple console output', async () => {
      let sampleESLintReport = require('../__fixtures__/sample-octane-eslint-report.json');
      let sampleTemplateLintReport = require('../__fixtures__/sample-octane-template-lint-report.json');
      let task = new OctaneMigrationStatusTask({});
      let taskResult = new OctaneMigrationStatusTaskResult(
        task.meta,
        sampleESLintReport,
        sampleTemplateLintReport
      );

      taskResult.stdout();

      expect(stdout()).toMatchSnapshot();
    });
  });

  describe('JSON output', () => {
    test('it should have basic JSON results', () => {
      let sampleESLintReport = require('../__fixtures__/sample-octane-eslint-report.json');
      let sampleTemplateLintReport = require('../__fixtures__/sample-octane-template-lint-report.json');
      let task = new OctaneMigrationStatusTask({});
      let taskResult = new OctaneMigrationStatusTaskResult(
        task.meta,
        sampleESLintReport,
        sampleTemplateLintReport
      );

      let jsonResults = taskResult.json();
      let { totalViolations, migrationTasks } = jsonResults.result.esLint;
      let nativeClassesMigrationInfo = migrationTasks[MigrationType.NativeClasses];

      expect(totalViolations).toBe(17);
      expect(nativeClassesMigrationInfo).toBeDefined();
      expect(nativeClassesMigrationInfo.name).toBe('Native Class');
    });

    test('it should output detailed completion data', () => {
      let sampleESLintReport = require('../__fixtures__/sample-octane-eslint-report.json');
      let sampleTemplateLintReport = require('../__fixtures__/sample-octane-template-lint-report.json');
      let task = new OctaneMigrationStatusTask({});
      let taskResult = new OctaneMigrationStatusTaskResult(
        task.meta,
        sampleESLintReport,
        sampleTemplateLintReport
      );

      let jsonResults = taskResult.json();
      let { migrationTasks } = jsonResults.result.esLint;
      let nativeClassesMigrationInfo = migrationTasks[MigrationType.NativeClasses];

      expect(nativeClassesMigrationInfo).toBeDefined();
      expect(nativeClassesMigrationInfo.completionInfo.total).toBe(11);
      expect(nativeClassesMigrationInfo.completionInfo.completed).toBe(1);
      expect(nativeClassesMigrationInfo.completionInfo.percentage).toBe('9.09');

      let taglessComponentsMigrationInfo = migrationTasks[MigrationType.TaglessComponents];

      expect(taglessComponentsMigrationInfo).toBeDefined();
      expect(taglessComponentsMigrationInfo.completionInfo.total).toBe(6);
      expect(taglessComponentsMigrationInfo.completionInfo.completed).toBe(5);
      expect(taglessComponentsMigrationInfo.completionInfo.percentage).toBe('83.33');

      let glimmerComponentMigrationInfo = migrationTasks[MigrationType.GlimmerComponents];

      expect(glimmerComponentMigrationInfo).toBeDefined();
      expect(glimmerComponentMigrationInfo.completionInfo.total).toBe(6);
      expect(glimmerComponentMigrationInfo.completionInfo.completed).toBe(4);
      expect(glimmerComponentMigrationInfo.completionInfo.percentage).toBe('66.67');

      let trackedPropertiesMigrationInfo = migrationTasks[MigrationType.TrackedProperties];

      expect(trackedPropertiesMigrationInfo).toBeDefined();
      expect(trackedPropertiesMigrationInfo.completionInfo.total).toBe(6);
      expect(trackedPropertiesMigrationInfo.completionInfo.completed).toBe(5);
      expect(trackedPropertiesMigrationInfo.completionInfo.percentage).toBe('83.33');
    });
  });
});
