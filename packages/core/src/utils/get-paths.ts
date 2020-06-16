import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { FilePathsArray } from './file-paths-array';

const isValidGlob = require('is-valid-glob');
const micromatch = require('micromatch');
const walkSync = require('walk-sync');
const debug = require('debug')('checkup:get-paths');

const PATHS_TO_IGNORE: string[] = [
  '**/node_modules/**',
  'bower_components/**',
  '**/tests/dummy/**',
  'concat-stats-for/**',
  'dist/**',
  'build/**',
  'vendor/**',
  '.git/**',
];

/**
 * @param basePath
 */
export function getFilePaths(
  basePath: string,
  globs: string[] = [],
  excludePaths: string[] = []
): FilePathsArray {
  let mergedPathsToIgnore = [...excludePaths, ...PATHS_TO_IGNORE];

  if (globs.length > 0) {
    debug('Expanding file globs...');
    let expandedGlobs = expandFileGlobs(globs, basePath, mergedPathsToIgnore);
    debug(`${expandedGlobs.length} file paths fetched!`);

    return expandedGlobs;
  }

  debug('Fetching all file paths via walkSync...');
  const allFiles: string[] = walkSync(basePath, {
    ignore: mergedPathsToIgnore,
    directories: false,
  });

  let resolvedPaths = resolveFilePaths(allFiles, basePath);
  debug(`${resolvedPaths.length} file paths fetched!`);

  return resolvedPaths;
}

function expandFileGlobs(
  filePatterns: string[],
  basePath: string,
  excludePaths: string[]
): FilePathsArray {
  return new FilePathsArray(
    ...filePatterns.flatMap((pattern) => {
      let isLiteralPath = !isValidGlob(pattern) && existsSync(pattern);

      if (isLiteralPath) {
        let isIgnored = !micromatch.isMatch(pattern, excludePaths);

        if (!isIgnored) {
          return pattern;
        }

        return [];
      }

      debug(`Fetching file paths associated with ${pattern} via walkSync...`);
      let expandedGlobs = walkSync(basePath, {
        globs: [pattern],
        directories: false,
        ignore: excludePaths,
      }) as string[];

      return resolveFilePaths(expandedGlobs, basePath);
    })
  );
}

function resolveFilePaths(filePaths: string[], basePath: string): FilePathsArray {
  if (basePath !== '.') {
    let resolvedPaths = filePaths.map((pathName: string) => {
      return join(resolve(basePath), pathName);
    });
    return new FilePathsArray(...resolvedPaths);
  }
  return new FilePathsArray(...filePaths);
}
