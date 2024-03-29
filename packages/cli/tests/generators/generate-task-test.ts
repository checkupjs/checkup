/* eslint-disable jest/expect-expect */

import { resolve } from 'path';
import * as helpers from 'yeoman-test';

import { testRoot } from '@checkup/test-helpers';
import TaskGenerator from '../../src/generators/task';
import { generatePlugin } from '../__utils__/generator-utils';

function assertTaskFiles(name: string, dir: string, extension: string = 'ts') {
  let root = testRoot(dir);

  expect(
    root.file(`${extension === 'ts' ? 'src' : 'lib'}/tasks/${name}-task.${extension}`).contents
  ).toMatchSnapshot();
  expect(root.file(`__tests__/${name}-task-test.${extension}`).contents).toMatchSnapshot();
}

function assertPluginFiles(dir: string, extension: string = 'ts') {
  let root = testRoot(dir);

  expect(
    root.file(`${extension === 'ts' ? 'src' : 'lib'}/index.${extension}`).contents
  ).toMatchSnapshot();
}

describe('task generator', () => {
  it('generates correct files with TypeScript for defaults', async () => {
    let baseDir = await generatePlugin();
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(baseDir)
      .withOptions({
        name: 'my-foo',
        path: '.',
        defaults: true,
      });

    assertTaskFiles('my-foo', dir.cwd);
    assertPluginFiles(dir.cwd);
  });

  it('generates correct files with TypeScript for defaults in custom path', async () => {
    let baseDir = await generatePlugin({ path: './lib' });
    await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(resolve(baseDir, '../..'))
      .withOptions({
        name: 'my-foo',
        defaults: true,
        path: './lib/checkup-plugin-my-plugin',
      });

    assertTaskFiles('my-foo', baseDir);
    assertPluginFiles(baseDir);
  });

  it('generates multiple correct files with TypeScript for defaults', async () => {
    let baseDir = await generatePlugin();
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(baseDir)
      .withOptions({
        name: 'my-foo',
        path: '.',
        defaults: true,
      });

    dir = await helpers.run(TaskGenerator, { namespace: 'checkup:task' }).cd(baseDir).withOptions({
      name: 'my-bar',
      path: '.',
      defaults: true,
    });

    assertTaskFiles('my-foo', dir.cwd);
    assertTaskFiles('my-bar', dir.cwd);
    assertPluginFiles(dir.cwd);
  });

  it('generates correct files with JavaScript', async () => {
    let baseDir = await generatePlugin(
      { name: 'my-plugin', path: '.', defaults: false },
      { typescript: false }
    );
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(baseDir)
      .withOptions({
        name: 'my-foo',
        path: '.',
      })
      .withPrompts({
        typescript: false,
        description: 'Some description',
        category: 'foo',
        group: 'bar',
      });

    assertTaskFiles('my-foo', dir.cwd, 'js');
    assertPluginFiles(dir.cwd, 'js');
  });

  it('generates correct files with typescript', async () => {
    let baseDir = await generatePlugin();
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(baseDir)
      .withOptions({
        name: 'my-foo',
        path: '.',
      })
      .withPrompts({
        description: 'Some description',
        category: 'foo',
        group: 'bar',
      });

    assertTaskFiles('my-foo', dir.cwd);
    assertPluginFiles(dir.cwd);
  });

  it('generates correct files with category', async () => {
    let baseDir = await generatePlugin();
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(baseDir)
      .withOptions({
        name: 'my-foo',
        path: '.',
      })
      .withPrompts({
        description: 'Some description',
        category: 'foo',
        group: 'bar',
      });

    assertTaskFiles('my-foo', dir.cwd);
    assertPluginFiles(dir.cwd);
  });

  it('generates correct files with group', async () => {
    let baseDir = await generatePlugin();
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(baseDir)
      .withOptions({
        name: 'my-foo',
        path: '.',
      })
      .withPrompts({
        description: 'Some description',
        category: 'foo',
        group: 'bar',
      });

    assertTaskFiles('my-foo', dir.cwd);
    assertPluginFiles(dir.cwd);
  });
});
