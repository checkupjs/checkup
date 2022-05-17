import '@microsoft/jest-sarif';
import { EmberProject, getTaskContext } from '@checkup/test-helpers';

import { getPluginName } from '@checkup/core';
import EmberDependenciesTask from '../src/tasks/ember-dependencies-task';

describe('dependencies-task', () => {
  let emberProject: EmberProject;
  let pluginName = getPluginName(import.meta.url);

  beforeEach(function () {
    emberProject = new EmberProject('checkup-app', '0.0.0', (project) => {
      project.addDependency('ember-source', '^3.15.0');
      project.addDependency('ember-cli', '^3.15.0');
      project.addDevDependency('ember-cli-string-utils', 'latest');
    });

    emberProject.addAddon('ember-cli-blueprint-test-helpers', 'latest');
    emberProject.writeSync();
  });

  afterEach(function () {
    emberProject.dispose();
  });

  it('produces valid SARIF for detected dependencies', async () => {
    const results = await new EmberDependenciesTask(
      pluginName,
      getTaskContext({
        options: { cwd: emberProject.baseDir },
        pkg: emberProject.pkg,
        paths: emberProject.filePaths,
      })
    ).run();

    for (let result of results) {
      expect(result).toBeValidSarifFor('result');
    }
  });
});
