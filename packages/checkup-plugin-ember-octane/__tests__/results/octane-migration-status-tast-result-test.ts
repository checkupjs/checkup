import { ESLintReport, TemplateLintReport, getRegisteredParsers } from '@checkup/core';
import { filterPieChartDataForTest, stdout } from '@checkup/test-helpers';

import OctaneMigrationStatusTask from '../../src/tasks/octane-migration-status-task';
import OctaneMigrationStatusTaskResult from '../../src/results/octane-migration-status-task-result';

describe('octane-migration-status-task-result', () => {
  let sampleESLintReport: ESLintReport;
  let sampleTemplateLintReport: TemplateLintReport;

  beforeEach(() => {
    sampleESLintReport = require('../__fixtures__/sample-octane-eslint-report.json');
    sampleTemplateLintReport = require('../__fixtures__/sample-octane-template-lint-report.json');
  });

  describe('console output', () => {
    test('simple console output', async () => {
      let task = new OctaneMigrationStatusTask({}, getRegisteredParsers());
      let taskResult = new OctaneMigrationStatusTaskResult(
        task.meta,
        sampleESLintReport,
        sampleTemplateLintReport
      );

      taskResult.toConsole();

      expect(stdout()).toMatchSnapshot();
    });
  });

  describe('JSON output', () => {
    test('it should have basic JSON results', () => {
      let task = new OctaneMigrationStatusTask({}, getRegisteredParsers());
      let taskResult = new OctaneMigrationStatusTaskResult(
        task.meta,
        sampleESLintReport,
        sampleTemplateLintReport
      );

      let jsonResults = taskResult.toJson();

      expect(jsonResults).toMatchSnapshot();
    });
  });

  describe('HTML output', () => {
    test('it should have basic HTML results', () => {
      let task = new OctaneMigrationStatusTask({}, getRegisteredParsers());
      let taskResult = new OctaneMigrationStatusTaskResult(
        task.meta,
        sampleESLintReport,
        sampleTemplateLintReport
      );
      let htmlResults = taskResult.toReportData();

      expect(filterPieChartDataForTest(htmlResults)).toMatchSnapshot();
    });
  });
});
