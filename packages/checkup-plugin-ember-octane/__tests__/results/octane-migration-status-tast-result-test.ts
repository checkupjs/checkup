import { ESLintReport, TemplateLintReport, getPluginName } from '@checkup/core';
import { getTaskContext, stdout } from '@checkup/test-helpers';

import OctaneMigrationStatusTask from '../../src/tasks/octane-migration-status-task';
import OctaneMigrationStatusTaskResult from '../../src/results/octane-migration-status-task-result';

describe('octane-migration-status-task-result', () => {
  let esLintReport: ESLintReport;
  let templateLintReport: TemplateLintReport;
  let pluginName = getPluginName(__dirname);

  beforeEach(() => {
    esLintReport = require('../__fixtures__/sample-octane-eslint-report.json');
    templateLintReport = require('../__fixtures__/sample-octane-template-lint-report.json');
  });

  describe('console output', () => {
    test('simple console output', async () => {
      let task = new OctaneMigrationStatusTask(pluginName, getTaskContext());
      let taskResult = new OctaneMigrationStatusTaskResult(task.meta, task.config);

      taskResult.process({ esLintReport, templateLintReport });

      taskResult.toConsole();

      expect(stdout()).toMatchSnapshot();
    });
  });

  describe('JSON output', () => {
    test('it should have basic JSON results', () => {
      let task = new OctaneMigrationStatusTask(pluginName, getTaskContext());
      let taskResult = new OctaneMigrationStatusTaskResult(task.meta, task.config);

      taskResult.process({ esLintReport, templateLintReport });

      let jsonResults = taskResult.toJson();

      expect(jsonResults).toMatchSnapshot();
    });
  });
});
