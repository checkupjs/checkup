import { CheckupProject, stdout, getTaskContext } from '@checkup/test-helpers';
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
    expect(taskResult.actions).toHaveLength(3);
    expect(taskResult.actions).toMatchInlineSnapshot(`
      Array [
        Object {
          "defaultThreshold": 0.05,
          "details": "1 major versions outdated",
          "input": 0.5,
          "items": Array [],
          "name": "reduce-outdated-major-dependencies",
          "summary": "Update outdated major versions",
        },
        Object {
          "defaultThreshold": 0.05,
          "details": "1 minor versions outdated",
          "input": 0.5,
          "items": Array [],
          "name": "reduce-outdated-minor-dependencies",
          "summary": "Update outdated minor versions",
        },
        Object {
          "defaultThreshold": 0.2,
          "details": "100% of versions outdated",
          "input": 1,
          "items": Array [],
          "name": "reduce-outdated-dependencies",
          "summary": "Update outdated versions",
        },
      ]
    `);
  });
});
