import { getPluginName } from '@checkup/core';
import { EmberProject, getTaskContext } from '@checkup/test-helpers';
import EmberInRepoAddonEnginesTask from '../src/tasks/ember-in-repo-addons-engines-task';

describe('ember-in-repo-addons-engines-task', () => {
  let emberProject: EmberProject;
  let pluginName = getPluginName(__dirname);

  beforeEach(() => {
    emberProject = new EmberProject('checkup-app', '0.0.0', (emberProject) => {
      emberProject.addDependency('ember-cli', '^3.15.0');
    });
    emberProject.addInRepoAddon('admin', 'latest');
    emberProject.addInRepoAddon('shopping-cart', 'latest');
    emberProject.addInRepoEngine('foo-engine', 'latest');
    emberProject.addInRepoEngine('shmoo-engine', 'latest');
    emberProject.writeSync();
  });

  afterEach(() => {
    emberProject.dispose();
  });

  it('can read task as JSON', async () => {
    const result = await new EmberInRepoAddonEnginesTask(
      pluginName,
      getTaskContext({
        pkg: emberProject.pkg,
        options: { cwd: emberProject.baseDir },
        paths: emberProject.filePaths,
      })
    ).run();

    expect(result).toMatchSnapshot();
  });
});
