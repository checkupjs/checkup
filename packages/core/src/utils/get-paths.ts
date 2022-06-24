import { resolve } from 'path';
import { PathLike, statSync } from 'fs';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { fileURLToPath } from 'url';
import esMain from 'es-main';

import isGlob from 'is-glob';
import micromatch from 'micromatch';
import { globbySync, Options } from 'globby';
import { FilePathArray } from './file-path-array.js';
import { toAbsolute } from './path.js';

const STDIN = '/dev/stdin';

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
    const worker = new Worker(fileURLToPath(import.meta.url), {
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

export function getFilePaths(
  baseDir: string,
  globsOrPaths: string[] = [],
  excludePaths: string[] = []
): FilePathArray {
  let files: Set<string>;
  let ignore = [...excludePaths, ...PATHS_TO_IGNORE];
  let patterns = globsOrPaths.length === 0 ? ['.'] : globsOrPaths;

  files =
    patterns.includes('-') || patterns.includes(STDIN)
      ? new Set([STDIN])
      : expandFileGlobs(baseDir, patterns, ignore);

  return new FilePathArray(...files);
}

export function expandFileGlobs(
  baseDir: string,
  globsOrPaths: string[],
  excludePaths: string[],
  glob = executeGlobby
) {
  let result = new Set<string>();

  for (const pattern of globsOrPaths) {
    let isLiteralPath = !isGlob(pattern) && isFile(resolve(baseDir, pattern));

    if (isLiteralPath) {
      let isIgnored = micromatch.isMatch(pattern, excludePaths);

      if (!isIgnored) {
        result.add(toAbsolute(baseDir, pattern));
      }

      continue;
    }

    const globResults = glob(baseDir, pattern, excludePaths);

    for (const filePath of globResults) {
      result.add(toAbsolute(baseDir, filePath));
    }
  }

  return result;
}

function executeGlobby(baseDir: string, pattern: string | readonly string[], ignore: string[]) {
  let options: Options = { cwd: baseDir, gitignore: true, ignore };

  return globbySync(pattern, options);
}

function isFile(possibleFile: PathLike) {
  try {
    let stat = statSync(possibleFile);
    return stat.isFile();
  } catch {
    return false;
  }
}

if (esMain(import.meta) && !isMainThread) {
  parentPort?.postMessage(
    getFilePaths(workerData.basePath, workerData.globsOrPaths, workerData.excludePaths)
  );
}
