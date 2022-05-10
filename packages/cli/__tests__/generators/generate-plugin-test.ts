import { join } from 'path';
import { createTmpDir, testRoot } from '@checkup/test-helpers';

import { generatePlugin } from '../__utils__/generator-utils.js';

describe('plugin generator', () => {
  let tmp: string;

  let expectedTsPackageJsonObject = {
    name: expect.any(String),
    description: expect.any(String),
    version: expect.any(String),
    author: expect.any(String),
    dependencies: {
      '@checkup/core': expect.any(String),
      tslib: expect.any(String),
    },
    devDependencies: {
      '@checkup/plugin': expect.any(String),
      '@checkup/test-helpers': expect.any(String),
      '@types/jest': expect.any(String),
      '@types/node': expect.any(String),
      '@typescript-eslint/eslint-plugin': expect.any(String),
      '@typescript-eslint/parser': expect.any(String),
      eslint: expect.any(String),
      'eslint-config-prettier': expect.any(String),
      'eslint-plugin-jest': expect.any(String),
      'eslint-plugin-node': expect.any(String),
      'eslint-plugin-prettier': expect.any(String),
      jest: expect.any(String),
      prettier: expect.any(String),
      'ts-jest': expect.any(String),
      'ts-node': expect.any(String),
      typescript: expect.any(String),
    },
    engines: {
      node: expect.any(String),
    },
    files: ['/lib'],
    keywords: ['checkup-plugin'],
    license: 'MIT',
    repository: expect.any(String),
    scripts: {
      build: 'yarn clean && tsc',
      'build:watch': 'yarn build -w',
      clean: 'rm -rf lib',
      'docs:generate': 'checkup-plugin docs',
      lint: 'eslint . --cache --ext .ts',
      test: 'jest --no-cache',
    },
    types: 'lib/index.d.ts',
    main: 'lib/index.js',
  };

  beforeEach(() => {
    tmp = createTmpDir();
  });

  it('generates plugin with defaults', async () => {
    let dir = await generatePlugin();

    let root = testRoot(dir);

    expect(JSON.parse(root.file('package.json').contents)).toMatchObject(
      expectedTsPackageJsonObject
    );

    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin with defaults in custom path', async () => {
    let dir = await generatePlugin({ path: './lib' });

    let root = testRoot(dir);

    expect(JSON.parse(root.file('package.json').contents)).toMatchObject(
      expectedTsPackageJsonObject
    );
    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin with JavaScript defaults', async () => {
    let dir = await generatePlugin({ defaults: false }, { typescript: false });

    let root = testRoot(dir);

    expect(JSON.parse(root.file('package.json').contents)).toMatchObject({
      name: expect.any(String),
      description: expect.any(String),
      version: expect.any(String),
      author: expect.any(String),
      dependencies: {
        '@checkup/core': expect.any(String),
      },
      devDependencies: {
        '@checkup/test-helpers': expect.any(String),
        eslint: expect.any(String),
        'eslint-config-prettier': expect.any(String),
        'eslint-plugin-jest': expect.any(String),
        'eslint-plugin-node': expect.any(String),
        'eslint-plugin-prettier': expect.any(String),
        jest: expect.any(String),
        prettier: expect.any(String),
      },
      engines: {
        node: expect.any(String),
      },
      files: ['/lib'],
      keywords: ['checkup-plugin'],
      license: 'MIT',
      repository: expect.any(String),
      scripts: {
        lint: 'eslint . --cache',
        test: 'jest --no-cache',
      },
      main: 'lib/index.js',
    });

    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('lib/index.js').contents).toMatchSnapshot();
    expect(root.file('lib/types/index.js').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('lib/results').contents).toMatchSnapshot();
    expect(root.directory('lib/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin with unmodified name with defaults', async () => {
    let dir = await generatePlugin({ name: 'foo' });

    let root = testRoot(dir);

    expect(JSON.parse(root.file('package.json').contents)).toMatchObject(
      expectedTsPackageJsonObject
    );
    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });

  it('generates plugin into existing directory with defaults', async () => {
    let existingDir = join(tmp, 'checkup-plugin-bar');

    await generatePlugin({ name: 'bar' }, {}, tmp);

    let root = testRoot(existingDir);

    expect(JSON.parse(root.file('package.json').contents)).toMatchObject(
      expectedTsPackageJsonObject
    );
    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
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

    expect(JSON.parse(root.file('package.json').contents)).toMatchObject(
      expectedTsPackageJsonObject
    );
    expect(root.file('.eslintignore').contents).toMatchSnapshot();
    expect(root.file('.eslintrc').contents).toMatchSnapshot();
    expect(root.file('.gitignore').contents).toMatchSnapshot();
    expect(root.file('.prettierrc.js').contents).toMatchSnapshot();
    expect(root.file('README.md').contents).toMatchSnapshot();
    expect(root.file('jest.config.js').contents).toMatchSnapshot();
    expect(root.file('tsconfig.json').contents).toMatchSnapshot();
    expect(root.file('src/index.ts').contents).toMatchSnapshot();
    expect(root.file('src/types/index.ts').contents).toMatchSnapshot();
    expect(root.directory('__tests__').contents).toMatchSnapshot();
    expect(root.directory('src/results').contents).toMatchSnapshot();
    expect(root.directory('src/tasks').contents).toMatchSnapshot();
  });
});
