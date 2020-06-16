import { ESLintReport, TemplateLintReport, getPluginName } from '@checkup/core';
import { getTaskContext, stdout } from '@checkup/test-helpers';

import OctaneMigrationStatusTask from '../../src/tasks/octane-migration-status-task';
import OctaneMigrationStatusTaskResult from '../../src/results/octane-migration-status-task-result';

describe('octane-migration-status-task-result', () => {
  let sampleESLintReport: ESLintReport;
  let sampleTemplateLintReport: TemplateLintReport;
  let pluginName = getPluginName(__dirname);

  beforeEach(() => {
    sampleESLintReport = require('../__fixtures__/sample-octane-eslint-report.json');
    sampleTemplateLintReport = require('../__fixtures__/sample-octane-template-lint-report.json');
  });

  describe('console output', () => {
    test('simple console output', async () => {
      let task = new OctaneMigrationStatusTask(pluginName, getTaskContext());
      let taskResult = new OctaneMigrationStatusTaskResult(
        task.meta,
        task.config,
        sampleESLintReport,
        sampleTemplateLintReport
      );

      taskResult.toConsole();

      expect(stdout()).toMatchSnapshot();
    });
  });

  describe('JSON output', () => {
    test('it should have basic JSON results', () => {
      let task = new OctaneMigrationStatusTask(pluginName, getTaskContext());
      let taskResult = new OctaneMigrationStatusTaskResult(
        task.meta,
        task.config,
        sampleESLintReport,
        sampleTemplateLintReport
      );

      let jsonResults = taskResult.toJson();

      expect(jsonResults).toMatchSnapshot();
    });
  });
});
