import { join, resolve } from 'path';
import { existsSync } from 'fs';

const micromatch = require('micromatch');
const isValidGlob = require('is-valid-glob');
const walkSync = require('walk-sync');
const globby = require('globby');

const PATHS_TO_IGNORE = [
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
): string[] {
  let mergedPathsToIgnore = [...excludePaths, ...PATHS_TO_IGNORE];

  if (globs.length > 0) {
    return expandFileGlobs(globs, basePath, mergedPathsToIgnore);
  }
  const allFiles: string[] = walkSync(basePath, {
    ignore: mergedPathsToIgnore,
    directories: false,
  });

  return resolveFilePaths(allFiles, basePath);
}

function expandFileGlobs(
  filePatterns: string[],
  basePath: string,
  excludePaths: string[]
): string[] {
  return filePatterns.flatMap((pattern) => {
    let isLiteralPath = !isValidGlob(pattern) && existsSync(pattern);

    if (isLiteralPath) {
      let isIgnored = !micromatch.isMatch(pattern, PATHS_TO_IGNORE);

      if (!isIgnored) {
        return pattern;
      }

      return [];
    }

    let expandedGlobs = globby.sync(pattern, {
      cwd: basePath,
      ignore: excludePaths,
      gitignore: true,
    }) as string[];

    return resolveFilePaths(expandedGlobs, basePath);
  });
}

function resolveFilePaths(filePaths: string[], basePath: string): string[] {
  if (basePath !== '.') {
    return filePaths.map((pathName: string) => {
      return join(resolve(basePath), pathName);
    });
  }
  return filePaths;
}
