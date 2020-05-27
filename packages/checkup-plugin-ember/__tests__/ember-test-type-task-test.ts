import { EmberProject, stdout, getTaskContext } from '@checkup/test-helpers';
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
});
