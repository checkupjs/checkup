import { join, resolve } from 'path';
import { existsSync, statSync } from 'fs';
import { FilePathArray } from './file-path-array';

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const isGlob = require('is-glob');
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
 * Get the file paths to run on.
 *
 * @param {string} baseDir - The base directory
 * @param {string[]} [globsOrPaths=[]] - A list of globs or paths
 * @param {string[]} [excludePaths=[]] - A list of paths to exclude
 * @returns {Promise<FilePathArray>} - A promise that resolves to a file path array
 */
export function getFilePathsAsync(
  baseDir: string,
  globsOrPaths: string[] = [],
  excludePaths: string[] = []
) {
  return new Promise<FilePathArray>((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { basePath: baseDir, globsOrPaths, excludePaths },
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
 * Get the file paths to run on.
 *
 * @param {string} baseDir - The base directory
 * @param {string[]} [globsOrPaths=[]] - A list of globs or paths
 * @param {string[]} [excludePaths=[]] - A list of paths to exclude
 * @returns {FilePathArray} - A file path array
 */
export function getFilePaths(
  baseDir: string,
  globsOrPaths: string[] = [],
  excludePaths: string[] = []
): FilePathArray {
  let mergedPathsToIgnore = [...excludePaths, ...PATHS_TO_IGNORE];

  if (globsOrPaths.length > 0) {
    return expandGlobsOrPaths(baseDir, globsOrPaths, mergedPathsToIgnore);
  }

  const allFiles: string[] = walkSync(baseDir, {
    ignore: mergedPathsToIgnore,
    directories: false,
    globOptions: { dot: true },
  });

  return resolveFilePaths(baseDir, allFiles);
}

/**
 * Expands globs or paths
 *
 * @param {string} baseDir - The base directory
 * @param {string[]} [globsOrPaths=[]] - A list of globs or paths
 * @param {string[]} [excludePaths=[]] - A list of paths to exclude
 * @returns {FilePathArray} - A file path array
 */
function expandGlobsOrPaths(
  baseDir: string,
  globsOrPaths: string[],
  excludePaths: string[]
): FilePathArray {
  return new FilePathArray(
    ...globsOrPaths.flatMap((globOrPath) => {
      let isLiteralPath =
        !isGlob(globOrPath) &&
        existsSync(join(baseDir, globOrPath)) &&
        statSync(join(baseDir, globOrPath)).isFile();

      if (isLiteralPath) {
        let isIgnored = micromatch.isMatch(globOrPath, excludePaths);

        if (!isIgnored) {
          return resolveFilePaths(baseDir, [globOrPath]);
        }

        return [];
      }

      if (isGlob(globOrPath)) {
        let expandedGlob = walkSync(baseDir, {
          globs: [globOrPath],
          directories: false,
          ignore: excludePaths,
        }) as string[];

        return resolveFilePaths(baseDir, expandedGlob);
      }

      let baseSubDir = join(baseDir, globOrPath);
      let expandedFolder = walkSync(baseSubDir, {
        directories: false,
        ignore: excludePaths,
      }) as string[];

      return resolveFilePaths(baseSubDir, expandedFolder);
    })
  );
}

/**
 * Resvolves file paths against the base directory
 *
 * @param {string} baseDir - The base directory
 * @param {string[]} filePaths - A list of file paths
 * @returns {FilePathArray} - A file path array
 */
function resolveFilePaths(baseDir: string, filePaths: string[]): FilePathArray {
  if (baseDir !== '.') {
    let resolvedPaths = filePaths.map((filePath: string) => {
      return join(resolve(baseDir), filePath);
    });
    return new FilePathArray(...resolvedPaths);
  }
  return new FilePathArray(...filePaths);
}

if (require.main === module && !isMainThread) {
  parentPort.postMessage(
    getFilePaths(workerData.basePath, workerData.globsOrPaths, workerData.excludePaths)
  );
}
