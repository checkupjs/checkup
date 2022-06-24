import { CheckupProject } from '@checkup/test-helpers';
import { getFilePaths } from '../../src/utils/get-paths';

const APP_NAME = 'foo-app';

describe('getFilePaths', function () {
  let project: CheckupProject;

  beforeEach(function () {
    project = new CheckupProject(APP_NAME, '0.0.0');
    Object.assign(project.files, {
      foo: {
        'index.hbs': '{{!-- i should todo: write code --}}',
      },
      bar: {
        'index.js': '// TODO: write better code',
      },
      baz: {
        'index.js': '// TODO: write better code',
        nested: {
          'foo.js': 'console.log("foo!");',
        },
      },
      someFolder: {
        anotherFolder: {
          'goo.js': '// gooey',
          'shoe.js': '// shooey',
        },
      },
      node_modules: {
        '.bin': {
          'foo.js': 'whatever',
        },
        'index.js': '',
      },
    });
    project.writeSync();
  });

  afterEach(async function () {
    project.dispose();
  });

  describe('basic', function () {
    it('returns all files except exclusions when no patterns are provided', function () {
      let files = getFilePaths(project.baseDir);

      expect(files).toEqual([
        'index.js',
        'package.json',
        'bar/index.js',
        'baz/index.js',
        'foo/index.hbs',
        'baz/nested/foo.js',
        'someFolder/anotherFolder/goo.js',
        'someFolder/anotherFolder/shoe.js',
      ]);

      expect(files).not.toContain('node_modules');
    });

    it('returns all files when no patterns are provided and a base path other than "." is provided', function () {
      let files = getFilePaths(`${project.baseDir}/baz`);
      expect(files).toEqual(['index.js', 'nested/foo.js']);
    });

    it('filterByGlob works', function () {
      let files = getFilePaths(project.baseDir);

      expect(files.filterByGlob('**/*.hbs')).toEqual(['foo/index.hbs']);
    });

    it('handles a file path being passed in', function () {
      let files = getFilePaths(project.baseDir, ['bar/index.js']);

      expect(files).toEqual(['bar/index.js']);
    });

    it('handles a folder being passed in', function () {
      let files = getFilePaths(project.baseDir, ['someFolder/']);

      expect(files).toEqual([
        'someFolder/anotherFolder/goo.js',
        'someFolder/anotherFolder/shoe.js',
      ]);
    });
  });

  describe('glob', function () {
    it('resolves a glob pattern', function () {
      let files = getFilePaths(project.baseDir, ['**/*.hbs']);

      expect(files).toEqual(['foo/index.hbs']);
    });

    it('handles a mixture of globs and folders being passed in', function () {
      let files = getFilePaths(project.baseDir, ['someFolder/', '**/*.hbs']);

      expect(files).toEqual([
        'someFolder/anotherFolder/goo.js',
        'someFolder/anotherFolder/shoe.js',
        'foo/index.hbs',
      ]);
    });

    it('resolves a glob pattern when a base pattern other than "." is provided', function () {
      let files = getFilePaths(project.baseDir, ['*']);

      expect(files).toEqual(['index.js', 'package.json']);
    });

    it('respects a glob ignore option', function () {
      let baseDir = `${project.baseDir}/baz`;
      let files = getFilePaths(baseDir, ['**']);

      expect(files).toEqual(['index.js', 'nested/foo.js']);
    });
  });
});
