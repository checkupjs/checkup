import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { FilePathArray } from './file-path-array';

const isValidGlob = require('is-valid-glob');
const micromatch = require('micromatch');
const walkSync = require('walk-sync');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

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

export function getFilePathsAsync(
  basePath: string,
  globs: string[] = [],
  excludePaths: string[] = []
) {
  return new Promise<FilePathArray>((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { basePath, globs, excludePaths },
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code: number) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

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

if (require.main === module) {
  if (!isMainThread) {
    parentPort.postMessage(
      getFilePaths(workerData.basePath, workerData.globs, workerData.excludePaths)
    );
  }
}
