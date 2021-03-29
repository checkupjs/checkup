import { EmberProject, getTaskContext } from '@checkup/test-helpers';
import { getPluginName } from '@checkup/core';

import EmberTestTypesTask from '../src/tasks/ember-test-types-task';
import { evaluateActions } from '../src/actions/ember-test-types-actions';

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
      getTaskContext({ options: { cwd: project.baseDir }, paths: project.filePaths })
    ).run();

    expect(result).toMatchSnapshot();
  });

  it('returns all the test types found in the app and outputs to json', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TESTS,
    });

    project.writeSync();

    const result = await new EmberTestTypesTask(
      pluginName,
      getTaskContext({ options: { cwd: project.baseDir }, paths: project.filePaths })
    ).run();

    expect(result).toMatchSnapshot();
  });

  it('returns action item if more than 1% of your tests are skipped and if your ratio of application tests is not matching threshold', async () => {
    project.files = Object.assign(project.files, {
      'index.js': 'index js file',
      addon: TESTS,
    });

    project.writeSync();

    const task = new EmberTestTypesTask(
      pluginName,
      getTaskContext({
        options: { cwd: project.baseDir },
        paths: project.filePaths,
        config: {
          tasks: {
            'ember/ember-test-types': [
              'on',
              {
                actions: {
                  'ratio-application-tests': [
                    'on',
                    {
                      threshold: 3,
                    },
                  ],
                },
              },
            ],
          },
        },
      })
    );
    const result = await task.run();

    let actions = evaluateActions(result, task.config);

    expect(actions).toHaveLength(1);
    expect(actions).toMatchInlineSnapshot(`
      Array [
        Object {
          "defaultThreshold": 0.01,
          "details": "67% of tests are skipped",
          "input": 0.6666666666666666,
          "items": Array [
            "Total skipped tests: 8",
          ],
          "name": "reduce-skipped-tests",
          "summary": "Reduce number of skipped tests",
        },
      ]
    `);
  });
});
