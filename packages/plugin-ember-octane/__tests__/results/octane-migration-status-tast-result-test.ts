import { CLIEngine } from 'eslint';
import { stdout } from '@checkup/test-helpers';
import { OctaneMigrationStatusTask } from '../../src/tasks';
import { OctaneMigrationStatusTaskResult } from '../../src/results';

describe('octane-migration-status-task-result', () => {
  let sampleESLintReport: CLIEngine.LintReport;
  let sampleTemplateLintReport: CLIEngine.LintReport;

  beforeEach(() => {
    sampleESLintReport = require('../__fixtures__/sample-octane-eslint-report.json');
    sampleTemplateLintReport = require('../__fixtures__/sample-octane-template-lint-report.json');
  });

  describe('console output', () => {
    test('simple console output', async () => {
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
      let task = new OctaneMigrationStatusTask({});
      let taskResult = new OctaneMigrationStatusTaskResult(
        task.meta,
        sampleESLintReport,
        sampleTemplateLintReport
      );

      let jsonResults = taskResult.json();

      expect(jsonResults).toMatchSnapshot();
    });
  });
});
