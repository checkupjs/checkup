import { createTmpDir, testRoot } from '@checkup/test-helpers';

import { generatePlugin } from '../__utils__/generator-utils';
import { join } from 'path';

describe('plugin generator', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = createTmpDir();
  });

  it('generates plugin with defaults', async () => {
    let dir = await generatePlugin();

    let root = testRoot(dir);

    expect(root.file('package.json').contents).toMatchSnapshot();
    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('src/registrations/').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin with defaults in custom path', async () => {
    let dir = await generatePlugin({ path: './lib' });

    let root = testRoot(dir);

    expect(root.file('package.json').contents).toMatchSnapshot();
    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('src/registrations/').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin with JavaScript defaults', async () => {
    let dir = await generatePlugin({ defaults: false }, { typescript: false });

    let root = testRoot(dir);

    expect(root.file('package.json').contents).toMatchSnapshot();
    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('lib/index.js').contents).toMatchSnapshot();
    expect(root.file('lib/types/index.js').contents).toMatchSnapshot();
    expect(root.directory('lib/registrations/').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('lib/results').contents).toMatchSnapshot();
    expect(root.directory('lib/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin with unmodified name with defaults', async () => {
    let dir = await generatePlugin({ name: 'foo' });

    let root = testRoot(dir);

    expect(root.file('package.json').contents).toMatchSnapshot();
    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('src/registrations/').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin into existing directory with defaults', async () => {
    let existingDir = join(tmp, 'checkup-plugin-bar');

    await generatePlugin({ name: 'bar' }, {}, tmp);

    let root = testRoot(existingDir);

    expect(root.file('package.json').contents).toMatchSnapshot();
    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('src/registrations/').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin with custom options', async () => {
    let dir = await generatePlugin(
      {
        name: 'my-plugin',
        defaults: false,
      },
      {
        description: 'My custom plugin',
        author: 'scalvert <steve.calvert@gmail.com>',
        repository: 'http://github.com/scalvert/checkup-plugin-my-plugin',
      }
    );

    let root = testRoot(dir);

    expect(root.file('package.json').contents).toMatchSnapshot();
    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('src/registrations/').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });
});
