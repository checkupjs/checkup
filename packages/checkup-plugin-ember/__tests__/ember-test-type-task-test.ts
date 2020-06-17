import { EmberProject, stdout, getTaskContext, isActionEnabled } from '@checkup/test-helpers';
import { getPluginName } from '@checkup/core';

import EmberTestTypesTask from '../src/tasks/ember-test-types-task';
import EmberTestTypesTaskResult from '../src/results/ember-test-types-task-result';

const TESTS = {
  application: {
    tests: {
      'my-component-test.js': `
      module('test', function(hooks) {
        setupApplicationTest(hooks);

        test('testing foo');
        skip('testing shmoo')
        skip('testing shmoo')
      });
    `,
    },
    someFolder: {
      'my-component-test.js': `
      module('test', function(hooks) {
        setupApplicationTest(hooks);

        test('testing foo');
        skip('testing shmoo')
        skip('testing shmoo')
      });
    `,
    },
  },
  rendering: {
    tests: {
      'my-component-test.js': `
      module('test', function(hooks) {
        setupRenderingTest(hooks);

        test('testing foo');
        skip('testing shmoo')
        skip('testing shmoo')
      });
    `,
    },
  },
  unit: {
    tests: {
      'my-component-test.js': `
      module('test', function(hooks) {
        setupTest(hooks);

        test('testing foo');
        skip('testing shmoo')
        skip('testing shmoo')
      });
    `,
    },
  },
};

describe('ember-test-types-task', () => {
  let project: EmberProject;
  let pluginName = getPluginName(__dirname);

  beforeEach(function () {
    project = new EmberProject('checkup-app', '0.0.0');
  });

  afterEach(function () {
    project.dispose();
  });

  it('returns all the test types found in the app and outputs to the console', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TESTS,
    });

    project.writeSync();

    const result = await new EmberTestTypesTask(
      pluginName,
      getTaskContext({ cliFlags: { cwd: project.baseDir }, paths: project.filePaths })
    ).run();

    const testTypesTaskResult = <EmberTestTypesTaskResult>result;

    testTypesTaskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
    expect(stdout()).not.toContain('todo');
    expect(stdout()).not.toContain('only');
  });

  it('only renders todos/only test types if they a value > 0', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: {
        rendering: {
          tests: {
            'my-component-test.js': `
              module('test', function(hooks) {
                setupRenderingTest(hooks);

                test('testing foo');
                only('testing shmoo')
                todo('testing shmoo')
              });
            `,
          },
        },
      },
    });

    project.writeSync();

    const result = await new EmberTestTypesTask(
      pluginName,
      getTaskContext({ cliFlags: { cwd: project.baseDir }, paths: project.filePaths })
    ).run();

    const testTypesTaskResult = <EmberTestTypesTaskResult>result;

    testTypesTaskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
    expect(stdout()).toContain('todo');
    expect(stdout()).toContain('only');
  });

  it('returns all the test types (including nested) found in the app and outputs to the console', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TESTS,
    });
    project.addInRepoAddon('ember-super-button', 'latest');

    (project.files.lib as any)['ember-super-button'].addon = TESTS;

    project.writeSync();
    const result = await new EmberTestTypesTask(
      pluginName,
      getTaskContext({ cliFlags: { cwd: project.baseDir }, paths: project.filePaths })
    ).run();

    const testTypesTaskResult = <EmberTestTypesTaskResult>result;

    testTypesTaskResult.toConsole();

    expect(stdout()).toMatchSnapshot();
  });

  it('returns all the test types found in the app and outputs to json', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TESTS,
    });

    project.writeSync();

    const result = await new EmberTestTypesTask(
      pluginName,
      getTaskContext({ cliFlags: { cwd: project.baseDir }, paths: project.filePaths })
    ).run();

    const testTypesTaskResult = <EmberTestTypesTaskResult>result;

    let json = testTypesTaskResult.toJson();

    expect(json).toMatchSnapshot();
  });

  it('returns action item if more than 1% of your tests are skipped and if your ratio of application tests is not matching threshold', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TESTS,
    });

    project.writeSync();

    const result = await new EmberTestTypesTask(
      pluginName,
      getTaskContext({
        cliFlags: { cwd: project.baseDir },
        paths: project.filePaths,
        config: {
          tasks: {
            'ember/ember-test-types': [
              'on',
              { actions: { 'ratio-application-tests': { threshold: 3 } } },
            ],
          },
        },
      })
    ).run();

    const testTypesTaskResult = <EmberTestTypesTaskResult>result;

    expect(
      isActionEnabled(testTypesTaskResult.actionList.enabledActions, 'percentage-skipped-tests')
    ).toEqual(true);

    expect(
      isActionEnabled(testTypesTaskResult.actionList.enabledActions, 'ratio-application-tests')
    ).toEqual(true);

    expect(testTypesTaskResult.actionList.actionMessages).toMatchInlineSnapshot(`
      Array [
        "67% of your tests are skipped, this value should be below 1%",
        "You have too many application tests. The number of unit tests and rendering tests combined should be at least 3x greater than the number of application tests.",
      ]
    `);
  });
});
