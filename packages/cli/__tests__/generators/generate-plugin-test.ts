import * as helpers from 'yeoman-test';

import { createTmpDir, testDir } from '@checkup/test-helpers';

import PluginGenerator from '../../src/generators/plugin';

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

    let testRoot = testDir(dir, 'my-plugin');

    expect(testRoot.file('package.json').contents).toMatchSnapshot();
    expect(testRoot.file('README.md').contents).toMatchSnapshot();
    expect(testRoot.file('jest.config.js').contents).toMatchSnapshot();
    expect(testRoot.file('tsconfig.json').contents).toMatchSnapshot();
    expect(testRoot.file('src/index.ts').contents).toMatchSnapshot();
    expect(testRoot.file('src/hooks/register-tasks.ts').contents).toMatchSnapshot();
    expect(testRoot.file('src/tasks/index.ts').contents).toMatchSnapshot();
    expect(testRoot.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(testRoot.directory('__tests__').contents).toMatchSnapshot();
    expect(testRoot.directory('src/results').contents).toMatchSnapshot();
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
        repository: 'http://github.com/scalvert/plugin-custom',
      });

    let testRoot = testDir(dir, 'my-plugin');

    expect(testRoot.file('package.json').contents).toMatchSnapshot();
    expect(testRoot.file('README.md').contents).toMatchSnapshot();
    expect(testRoot.file('jest.config.js').contents).toMatchSnapshot();
    expect(testRoot.file('tsconfig.json').contents).toMatchSnapshot();
    expect(testRoot.file('src/index.ts').contents).toMatchSnapshot();
    expect(testRoot.file('src/hooks/register-tasks.ts').contents).toMatchSnapshot();
    expect(testRoot.file('src/tasks/index.ts').contents).toMatchSnapshot();
    expect(testRoot.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(testRoot.directory('__tests__').contents).toMatchSnapshot();
    expect(testRoot.directory('src/results').contents).toMatchSnapshot();
  });
});
