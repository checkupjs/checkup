import { EmberProject, getTaskContext } from '@checkup/test-helpers';

import EmberDependenciesTask from '../src/tasks/ember-dependencies-task';
import { getPluginName } from '@checkup/core';

describe('dependencies-task', () => {
  let emberProject: EmberProject;
  let pluginName = getPluginName(__dirname);

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

  it('detects Ember dependencies as JSON', async () => {
    const result = await new EmberDependenciesTask(
      pluginName,
      getTaskContext({
        options: { cwd: emberProject.baseDir },
        pkg: emberProject.pkg,
        paths: emberProject.filePaths,
      })
    ).run();

    expect(result).toMatchSnapshot();
  });
});
