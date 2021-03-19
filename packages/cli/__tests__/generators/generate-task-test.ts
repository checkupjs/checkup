/* eslint-disable jest/expect-expect */

import * as helpers from 'yeoman-test';
import { resolve } from 'path';

import TaskGenerator from '../../src/generators/task';
import { generatePlugin } from '../__utils__/generator-utils';
import { testRoot } from '@checkup/test-helpers';

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
    root.file(`${extension === 'ts' ? 'src' : 'lib'}/registrations/register-tasks.${extension}`)
      .contents
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

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
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

    assertTaskFiles('my-foo', dir);
    assertTaskFiles('my-bar', dir);
    assertPluginFiles(dir);
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
        commandType: 'info',
        category: 'foo',
        group: 'bar',
      });

    assertTaskFiles('my-foo', dir, 'js');
    assertPluginFiles(dir, 'js');
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
        commandType: 'info',
        category: 'foo',
        group: 'bar',
      });

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
  });

  it('generates correct files with commandType', async () => {
    let baseDir = await generatePlugin();
    let dir = await helpers
      .run(TaskGenerator, { namespace: 'checkup:task' })
      .cd(baseDir)
      .withOptions({
        name: 'my-foo',
        path: '.',
      })
      .withPrompts({
        commandType: 'migration',
        category: 'foo',
        group: 'bar',
      });

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
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
        commandType: 'info',
        category: 'foo',
        group: 'bar',
      });

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
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
        commandType: 'info',
        category: 'foo',
        group: 'bar',
      });

    assertTaskFiles('my-foo', dir);
    assertPluginFiles(dir);
  });
});
