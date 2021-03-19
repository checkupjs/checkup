/* eslint-disable jest/expect-expect */

import * as helpers from 'yeoman-test';
import { resolve } from 'path';

import ActionsGenerator from '../../src/generators/actions';
import { generatePlugin } from '../__utils__/generator-utils';
import { testRoot } from '@checkup/test-helpers';

function assertActionsFiles(name: string, dir: string, extension: string = 'ts') {
  let root = testRoot(dir);

  expect(
    root.file(`${extension === 'ts' ? 'src' : 'lib'}/actions/${name}-actions.${extension}`).contents
  ).toMatchSnapshot();
}

describe('actions generator', () => {
  it('generates correct files with TypeScript', async () => {
    let baseDir = await generatePlugin();
    let dir = await helpers
      .run(ActionsGenerator, { namespace: 'checkup:actions' })
      .cd(baseDir)
      .withOptions({
        name: 'my-foo',
        path: '.',
      })
      .withPrompts({
        taskName: 'foo',
        typescript: true,
      });

    assertActionsFiles('my-foo', dir);
  });

  it('generates correct files with TypeScript in custom path', async () => {
    let baseDir = await generatePlugin({ path: './lib' });
    await helpers
      .run(ActionsGenerator, { namespace: 'checkup:actions' })
      .cd(resolve(baseDir, '../..'))
      .withOptions({
        name: 'my-foo',
        path: './lib/checkup-plugin-my-plugin',
      })
      .withPrompts({
        taskName: 'foo',
        typescript: true,
      });

    assertActionsFiles('my-foo', baseDir);
  });

  it('generates multiple correct files with TypeScript', async () => {
    let baseDir = await generatePlugin();
    let dir = await helpers
      .run(ActionsGenerator, { namespace: 'checkup:actions' })
      .cd(baseDir)
      .withOptions({
        name: 'my-foo',
        path: '.',
      })
      .withPrompts({
        taskName: 'foo',
        typescript: true,
      });

    dir = await helpers
      .run(ActionsGenerator, { namespace: 'checkup:actions' })
      .cd(baseDir)
      .withOptions({
        name: 'my-bar',
        path: '.',
      })
      .withPrompts({
        taskName: 'foo',
        typescript: true,
      });

    assertActionsFiles('my-foo', dir);
    assertActionsFiles('my-bar', dir);
  });

  it('generates correct files with JavaScript', async () => {
    let baseDir = await generatePlugin(
      { name: 'my-plugin', defaults: false },
      { typescript: false }
    );
    let dir = await helpers
      .run(ActionsGenerator, { namespace: 'checkup:actions' })
      .cd(baseDir)
      .withOptions({
        name: 'my-foo',
        path: '.',
      })
      .withPrompts({
        taskName: 'foo',
        typescript: false,
      });

    assertActionsFiles('my-foo', dir, 'js');
  });
});
