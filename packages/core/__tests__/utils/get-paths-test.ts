import { CheckupProject } from '@checkup/test-helpers';
import { FilePathArray } from '../../src/utils/file-path-array';
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
      let filteredFiles = filterFilePathResults(project.baseDir, getFilePaths(project.baseDir));

      expect(filteredFiles).toEqual([
        '/index.js',
        '/package.json',
        '/bar/index.js',
        '/baz/index.js',
        '/foo/index.hbs',
        '/baz/nested/foo.js',
        '/someFolder/anotherFolder/goo.js',
        '/someFolder/anotherFolder/shoe.js',
      ]);

      expect(filteredFiles).not.toContain('node_modules');
    });

    it('returns all files when no patterns are provided and a base path other than "." is provided', function () {
      let files = getFilePaths(`${project.baseDir}/baz`);
      expect(filterFilePathResults(project.baseDir, files)).toEqual([
        '/baz/index.js',
        '/baz/nested/foo.js',
      ]);
    });

    it('filterByGlob works', function () {
      let files = getFilePaths(project.baseDir);

      expect(filterFilePathResults(project.baseDir, files.filterByGlob('**/*.hbs'))).toEqual([
        '/foo/index.hbs',
      ]);
    });

    it('handles a file path being passed in', function () {
      let files = getFilePaths(project.baseDir, ['bar/index.js']);

      expect(filterFilePathResults(project.baseDir, files)).toEqual(['bar/index.js']);
    });

    it('handles a folder being passed in', function () {
      let files = getFilePaths(project.baseDir, ['someFolder/']);

      expect(filterFilePathResults(project.baseDir, files)).toEqual([
        'someFolder/anotherFolder/goo.js',
        'someFolder/anotherFolder/shoe.js',
      ]);
    });
  });

  describe('glob', function () {
    it('resolves a glob pattern', function () {
      let files = getFilePaths(project.baseDir, ['**/*.hbs']);

      expect(filterFilePathResults(project.baseDir, files)).toEqual(['foo/index.hbs']);
    });

    it('handles a mixture of globs and folders being passed in', function () {
      let files = getFilePaths(project.baseDir, ['someFolder/', '**/*.hbs']);

      expect(filterFilePathResults(project.baseDir, files)).toEqual([
        'someFolder/anotherFolder/goo.js',
        'someFolder/anotherFolder/shoe.js',
        'foo/index.hbs',
      ]);
    });

    it('resolves a glob pattern when a base pattern other than "." is provided', function () {
      let files = getFilePaths(project.baseDir, ['*']);

      expect(filterFilePathResults(project.baseDir, files)).toEqual(['index.js', 'package.json']);
    });

    it('respects a glob ignore option', function () {
      let baseDir = `${project.baseDir}/baz`;
      let files = getFilePaths(baseDir, ['**']);

      expect(filterFilePathResults(baseDir, files)).toEqual(['index.js', 'nested/foo.js']);
    });
  });
});

function filterFilePathResults(baseDir: string, filePaths: string[]) {
  return new FilePathArray(
    ...filePaths.map((filePath) => {
      return filePath.includes(baseDir) ? filePath.split(baseDir).pop()! : filePath;
    })
  );
}
