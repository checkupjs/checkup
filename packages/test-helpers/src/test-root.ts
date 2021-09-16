import { readFileSync, readdirSync } from 'fs';

import { join } from 'path';

class TestRoot {
  constructor(public baseDir: string, ...paths: string[]) {
    this.baseDir = join(baseDir, ...paths);
  }

  file(...paths: string[]) {
    return new TestFile(this.baseDir, ...paths);
  }

  directory(...paths: string[]) {
    return new TestDirectory(this.baseDir, ...paths);
  }
}

class TestFile {
  filePath: string;
  contents: string;

  constructor(public baseDir: string, ...paths: string[]) {
    this.filePath = join(this.baseDir, ...paths);
    this.contents = readFileSync(this.filePath, 'utf-8');
  }
}

class TestDirectory {
  dirPath: string;
  contents: string[];

  constructor(public baseDir: string, ...paths: string[]) {
    this.dirPath = join(this.baseDir, ...paths);
    this.contents = readdirSync(this.dirPath);
  }
}

/**
 * Creates an instance of a class that can be used for assserting specific files under a root directory.
 *
 * @param {string} baseDir - The base directory to assert from.
 * @param {...string[]} paths - The paths to use for assertions.
 * @returns {TestRoot} - An instance of a TestRoot
 */
export function testRoot(baseDir: string, ...paths: string[]) {
  return new TestRoot(baseDir, ...paths);
}
