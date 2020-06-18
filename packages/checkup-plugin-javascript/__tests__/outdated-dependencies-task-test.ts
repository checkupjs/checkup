import { CheckupProject, stdout, getTaskContext, isActionEnabled } from '@checkup/test-helpers';
import { getPluginName } from '@checkup/core';
import OutdatedDependenciesTask from '../src/tasks/outdated-dependencies-task';
import OutdatedDependenciesTaskResult from '../src/results/outdated-dependencies-task-result';

// this test actually checks if dependencies are out of date, and will fail if new versions of react and react-dom are released.
describe('outdated-dependencies-task', () => {
  let project: CheckupProject;
  let pluginName = getPluginName(__dirname);
  let taskResult: OutdatedDependenciesTaskResult;

  beforeAll(async () => {
    project = new CheckupProject('checkup-app', '0.0.0', (project) => {
      project.addDependency('react', '^15.0.0');
      project.addDependency('react-dom', '16.0.0');
    });

    project.writeSync();
    project.gitInit();
    project.install();

    const result = await new OutdatedDependenciesTask(
      pluginName,
      getTaskContext({
        cliFlags: { cwd: project.baseDir },
        pkg: project.pkg,
      })
    ).run();
    taskResult = <OutdatedDependenciesTaskResult>result;
  });

  afterAll(() => {
    project.dispose();
  });

  it('detects outdated dependencies and output to console', async () => {
    taskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('detects outdated dependencies as JSON', async () => {
    expect(taskResult.toJson()).toMatchSnapshot();
  });

  it('returns correct action items if too many dependencies are out of date (and additional actions for minor/major out of date)', async () => {
    expect(
      isActionEnabled(taskResult.actionList.enabledActions, 'percentage-major-outdated')
    ).toEqual(true);
    expect(
      isActionEnabled(taskResult.actionList.enabledActions, 'percentage-minor-outdated')
    ).toEqual(true);
    expect(isActionEnabled(taskResult.actionList.enabledActions, 'percentage-outdated')).toEqual(
      true
    );

    expect(taskResult.actionList.actionMessages).toMatchInlineSnapshot(`
      Array [
        "50% of your dependencies are major versions behind, this should be at most 5%.",
        "50% of your dependencies are minor versions behind, this should be at most 5%.",
        "100% of your dependencies are outdated, this should be at most 20%.",
      ]
    `);
  });
});
