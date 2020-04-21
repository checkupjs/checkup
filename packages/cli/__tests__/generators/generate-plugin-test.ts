import * as helpers from 'yeoman-test';

import { createTmpDir, testRoot } from '@checkup/test-helpers';

import PluginGenerator from '../../src/generators/plugin';
import { join } from 'path';

describe('plugin generator', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = createTmpDir();
  });

  it('generates plugin with defaults', async () => {
    let dir = await helpers
      .run(PluginGenerator, { namespace: 'checkup:plugin' })
      .cd(tmp)
      .withOptions({
        name: 'my-plugin',
        defaults: true,
      });

    let root = testRoot(dir, 'checkup-plugin-my-plugin');

    expect(root.file('package.json').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/hooks/register-tasks.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin with unmodified name with defaults', async () => {
    let dir = await helpers
      .run(PluginGenerator, { namespace: 'checkup:plugin' })
      .cd(tmp)
      .withOptions({
        name: 'checkup-plugin-foo',
        defaults: true,
      });

    let root = testRoot(dir, 'checkup-plugin-foo');

    expect(root.file('package.json').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/hooks/register-tasks.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin into existing directory with defaults', async () => {
    let existingDir = join(tmp, 'checkup-plugin-bar');

    await helpers.run(PluginGenerator, { namespace: 'checkup:plugin' }).cd(tmp).withOptions({
      name: 'checkup-plugin-bar',
      defaults: true,
    });

    let root = testRoot(existingDir);

    expect(root.file('package.json').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/hooks/register-tasks.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin with custom options', async () => {
    let dir = await helpers
      .run(PluginGenerator, { namespace: 'checkup:plugin' })
      .cd(tmp)
      .withOptions({
        name: 'my-plugin',
      })
      .withPrompts({
        description: 'My custom plugin',
        author: 'scalvert <steve.calvert@gmail.com>',
        repository: 'http://github.com/scalvert/checkup-plugin-my-plugin',
      });

    let root = testRoot(dir, 'checkup-plugin-my-plugin');

    expect(root.file('package.json').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/hooks/register-tasks.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });
});
