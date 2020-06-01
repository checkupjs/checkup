import { getPluginName } from '@checkup/core';
import { EmberProject, getTaskContext, stdout } from '@checkup/test-helpers';
import EmberInRepoAddonEnginesTaskResult from '../src/results/ember-in-repo-addons-engines-task-result';
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

  it('can read task and output to console', async () => {
    const result = await new EmberInRepoAddonEnginesTask(
      pluginName,
      getTaskContext({
        cliFlags: { cwd: emberProject.baseDir },
        pkg: emberProject.pkg,
        paths: emberProject.filePaths,
      })
    ).run();
    const taskResult = <EmberInRepoAddonEnginesTaskResult>result;

    taskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('can read task as JSON', async () => {
    const result = await new EmberInRepoAddonEnginesTask(
      pluginName,
      getTaskContext({
        pkg: emberProject.pkg,
        cliFlags: { cwd: emberProject.baseDir },
        paths: emberProject.filePaths,
      })
    ).run();
    const taskResult = <EmberInRepoAddonEnginesTaskResult>result;
    taskResult.inRepoAddons.sort();
    taskResult.inRepoEngines.sort();

    expect(taskResult.toJson()).toMatchSnapshot();
  });
});
