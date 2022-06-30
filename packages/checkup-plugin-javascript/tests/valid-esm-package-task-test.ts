import { CheckupProject, getTaskContext } from '@checkup/test-helpers';
import { getPluginName } from '@checkup/core';
import ValidEsmPackageTask from '../src/tasks/valid-esm-package-task';

describe('valid-esm-package-task', () => {
  let project: CheckupProject;
  let pluginName = getPluginName(import.meta.url);

  beforeEach(() => {
    project = new CheckupProject('checkup-app', '0.0.0');

    project.writeSync();
    project.gitInit();
  });

  afterEach(() => {
    project.dispose();
  });

  it('valid esm package passes validation', async () => {
    project.write({
      'index.js': `function foo() { console.log('foo'); }`,
    });
    project.updatePackageJson({
      name: 'fake-package',
      type: 'module',
      exports: './index.js',
      description: '',
      version: '0.1.0',
      engines: {
        node: '>=13.2.0',
      },
      dependencies: {},
      devDependencies: {},
    });

    const results = await new ValidEsmPackageTask(
      pluginName,
      getTaskContext({
        options: { cwd: project.baseDir },
        pkg: project.pkg,
      })
    ).run();

    expect(results.filter((result) => result.kind === 'pass')).toHaveLength(5);
  });

  it('invalid esm package fails validation', async () => {
    project.write({
      'index.js': `"use strict";
  function foo() { console.log('foo'); }`,
    });
    project.updatePackageJson({
      name: 'fake-package',
      main: './index.js',
      description: '',
      version: '0.1.0',
      dependencies: {},
      devDependencies: {},
    });

    const results = await new ValidEsmPackageTask(
      pluginName,
      getTaskContext({
        options: { cwd: project.baseDir },
        pkg: project.pkg,
      })
    ).run();

    expect(results.filter((result) => result.kind === 'fail')).toHaveLength(5);
  });
});
