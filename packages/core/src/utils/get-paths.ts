import { join, resolve } from 'path';
import { existsSync, statSync } from 'fs';
import { FilePathArray } from './file-path-array';

const isGlob = require('is-glob');
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
  globsOrPaths: string[] = [],
  excludePaths: string[] = []
) {
  return new Promise<FilePathArray>((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { basePath, globsOrPaths, excludePaths },
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
  basePath: string,
  globsOrPaths: string[] = [],
  excludePaths: string[] = []
): FilePathArray {
  let mergedPathsToIgnore = [...excludePaths, ...PATHS_TO_IGNORE];

  if (globsOrPaths.length > 0) {
    return expandGlobsOrPaths(globsOrPaths, basePath, mergedPathsToIgnore);
  }

  const allFiles: string[] = walkSync(basePath, {
    ignore: mergedPathsToIgnore,
    directories: false,
    globOptions: { dot: true },
  });

  return resolveFilePaths(allFiles, basePath);
}

function expandGlobsOrPaths(
  globsOrPaths: string[],
  basePath: string,
  excludePaths: string[]
): FilePathArray {
  return new FilePathArray(
    ...globsOrPaths.flatMap((globOrPath) => {
      let isLiteralPath =
        !isGlob(globOrPath) &&
        existsSync(`${basePath}/${globOrPath}`) &&
        statSync(`${basePath}/${globOrPath}`).isFile();
      let isGlobString = isGlob(globOrPath);

      if (isLiteralPath) {
        let isIgnored = micromatch.isMatch(globOrPath, excludePaths);

        if (!isIgnored) {
          return resolveFilePaths([globOrPath], basePath);
        }

        return [];
      }

      if (isGlobString) {
        let expandedGlob = walkSync(basePath, {
          globs: [globOrPath],
          directories: false,
          ignore: excludePaths,
        }) as string[];

        return resolveFilePaths(expandedGlob, basePath);
      }

      let expandedFolder = walkSync(`${basePath}/${globOrPath}`, {
        directories: false,
        ignore: excludePaths,
      }) as string[];

      return resolveFilePaths(expandedFolder, basePath);
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
      getFilePaths(workerData.basePath, workerData.globsOrPaths, workerData.excludePaths)
    );
  }
}
