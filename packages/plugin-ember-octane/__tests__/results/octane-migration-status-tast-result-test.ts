import { OctaneMigrationStatusTask } from '../../src/tasks';
import { OctaneMigrationStatusTaskResult } from '../../src/results';
import { stdout } from '@checkup/test-helpers';

describe('octane-migration-status-task-result', () => {
  let sampleESLintReport;
  let sampleTemplateLintReport;

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
