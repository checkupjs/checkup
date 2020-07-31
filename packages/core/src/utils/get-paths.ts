import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { FilePathArray } from './file-path-array';

const isValidGlob = require('is-valid-glob');
const micromatch = require('micromatch');
const walkSync = require('walk-sync');

const PATHS_TO_IGNORE: string[] = [
  '**/node_modules/**',
  'bower_components/**',
  '**/tests/dummy/**',
  'concat-stats-for/**',
  'dist/**',
  'build/**',
  'vendor/**',
  '.git/**',
  '**/*.log',
  '*.log',
];

/**
 * @param basePath
 */
export function getFilePaths(
  basePath: string,
  globs: string[] = [],
  excludePaths: string[] = []
): FilePathArray {
  let mergedPathsToIgnore = [...excludePaths, ...PATHS_TO_IGNORE];

  if (globs.length > 0) {
    return expandFileGlobs(globs, basePath, mergedPathsToIgnore);
  }

  const allFiles: string[] = walkSync(basePath, {
    ignore: mergedPathsToIgnore,
    directories: false,
    globOptions: { dot: true },
  });

  return resolveFilePaths(allFiles, basePath);
}

function expandFileGlobs(
  filePatterns: string[],
  basePath: string,
  excludePaths: string[]
): FilePathArray {
  return new FilePathArray(
    ...filePatterns.flatMap((pattern) => {
      let isLiteralPath = !isValidGlob(pattern) && existsSync(pattern);

      if (isLiteralPath) {
        let isIgnored = !micromatch.isMatch(pattern, excludePaths);

        if (!isIgnored) {
          return pattern;
        }

        return [];
      }

      let expandedGlobs = walkSync(basePath, {
        globs: [pattern],
        directories: false,
        ignore: excludePaths,
      }) as string[];

      return resolveFilePaths(expandedGlobs, basePath);
    })
  );
}

function resolveFilePaths(filePaths: string[], basePath: string): FilePathArray {
  if (basePath !== '.') {
    let resolvedPaths = filePaths.map((pathName: string) => {
      return join(resolve(basePath), pathName);
    });
    return new FilePathArray(...resolvedPaths);
  }
  return new FilePathArray(...filePaths);
}
