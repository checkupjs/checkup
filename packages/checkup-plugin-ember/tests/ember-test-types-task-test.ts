import '@microsoft/jest-sarif';
import { EmberProject, getTaskContext } from '@checkup/test-helpers';
import { getPluginName } from '@checkup/core';
import EmberTestTypesTask from '../src/tasks/ember-test-types-task';

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
  let pluginName = getPluginName(import.meta.url);

  beforeEach(function () {
    project = new EmberProject('checkup-app', '0.0.0');
  });

  afterEach(function () {
    project.dispose();
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

    const results = await new EmberTestTypesTask(
      pluginName,
      getTaskContext({ options: { cwd: project.baseDir }, paths: project.filePaths })
    ).run();

    for (let result of results) {
      expect(result).toBeValidSarifFor('result');
    }
  });

  it('returns all the test types found in the app and outputs to json', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TESTS,
    });

    project.writeSync();

    const results = await new EmberTestTypesTask(
      pluginName,
      getTaskContext({ options: { cwd: project.baseDir }, paths: project.filePaths })
    ).run();

    for (let result of results) {
      expect(result).toBeValidSarifFor('result');
    }
  });
});
