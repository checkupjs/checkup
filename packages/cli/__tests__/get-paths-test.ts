'use strict';

import { CheckupProject } from '@checkup/test-helpers';
import { getFilePaths } from '../src/helpers/get-paths';

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
      },
    });
    project.writeSync();
  });

  afterEach(async function () {
    project.dispose();
  });

  describe('basic', function () {
    it('returns all files when no patterns are provided', function () {
      let files = getFilePaths(project.baseDir);

      expect(filterFilePathResults(files)).toMatchInlineSnapshot(`
        Array [
          "/bar/index.js",
          "/baz/index.js",
          "/foo/index.hbs",
          "/index.js",
          "/package.json",
        ]
      `);
    });

    it('returns all files when no patterns are provided and a base path other than "." is provided', function () {
      let files = getFilePaths(`${project.baseDir}/baz`);
      expect(filterFilePathResults(files)).toMatchInlineSnapshot(`
        Array [
          "/baz/index.js",
        ]
      `);
    });
  });

  describe('glob', function () {
    it('resolves a glob pattern', function () {
      let files = getFilePaths(project.baseDir, ['**/*.hbs']);

      expect(filterFilePathResults(files)).toMatchInlineSnapshot(`
        Array [
          "/foo/index.hbs",
        ]
      `);
    });

    it('resolves a glob pattern when a base pattern other than "." is provided', function () {
      let files = getFilePaths(project.baseDir, ['*']);

      expect(filterFilePathResults(files)).toMatchInlineSnapshot(`
        Array [
          "/index.js",
          "/package.json",
        ]
      `);
    });

    it('respects a glob ignore option', function () {
      let files = getFilePaths(`${project.baseDir}/baz`, ['**']);

      expect(filterFilePathResults(files)).toMatchInlineSnapshot(`
        Array [
          "/baz/index.js",
        ]
      `);
    });
  });
});

function filterFilePathResults(filePaths: string[]) {
  return filePaths.map((filePath) => {
    return filePath.split(APP_NAME)[1];
  });
}
