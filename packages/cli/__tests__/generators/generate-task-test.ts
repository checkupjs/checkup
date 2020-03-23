/* eslint-disable jest/expect-expect */

import * as helpers from 'yeoman-test';

import { CheckupPluginProject, testRoot } from '@checkup/test-helpers';

import TaskGenerator from '../../src/generators/task';

function assertTaskFiles(name: string, dir: string, extension: string = 'ts') {
  let root = testRoot(dir);

  expect(root.file(`src/tasks/${name}-task.${extension}`).contents).toMatchSnapshot();
  expect(root.file(`src/results/${name}-task-result.${extension}`).contents).toMatchSnapshot();
  expect(root.file(`__tests__/${name}-task-test.${extension}`).contents).toMatchSnapshot();
}

function assertPluginFiles(dir: string, extension: string = 'ts') {
  let root = testRoot(dir);

  expect(root.file(`src/tasks/index.${extension}`).contents).toMatchSnapshot();
  expect(root.file(`src/hooks/register-tasks.${extension}`).contents).toMatchSnapshot();
}

describe('task generator', () => {
  let project: CheckupPluginProject;

  beforeEach(function() {
    project = new CheckupPluginProject('@checkup/plugin-mock');
    project.writeSync();
  });

  afterEach(function() {
    project.dispose();
  });

  it('generates correct files with TypeScript for defaults', async () => {
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-foo',
        defaults: true,
      });

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
  });

  it('generates multiple correct files with TypeScript for defaults', async () => {
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-foo',
        defaults: true,
      });

    dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-bar',
        defaults: true,
      });

    assertTaskFiles('my-foo', dir);
    assertTaskFiles('my-bar', dir);
    assertPluginFiles(dir);
  });

  it('generates correct files with JavaScript', async () => {
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-foo',
      })
      .withPrompts({
        typescript: false,
      });

    assertTaskFiles('my-foo', dir, 'js');
    assertPluginFiles(dir, 'js');
  });

  it('generates correct files with category', async () => {
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-foo',
      })
      .withPrompts({
        category: 'Core',
      });

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
  });

  it('generates correct files with priority', async () => {
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(project.baseDir)
      .withOptions({
        name: 'my-foo',
      })
      .withPrompts({
        priority: 'High',
      });

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
  });
});
