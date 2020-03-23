import { readFileSync, readdirSync } from 'fs';

import { join } from 'path';

class TestRoot {
  constructor(public root: string, ...paths: string[]) {
    this.root = join(root, ...paths);
  }

  file(...paths: string[]) {
    return new TestFile(this.root, ...paths);
  }

  directory(...paths: string[]) {
    return new TestDirectory(this.root, ...paths);
  }
}

class TestFile {
  filePath: string;
  contents: string;

  constructor(public root: string, ...paths: string[]) {
    this.filePath = join(this.root, ...paths);
    this.contents = readFileSync(this.filePath, 'utf-8');
  }
}

class TestDirectory {
  dirPath: string;
  contents: string[];

  constructor(public root: string, ...paths: string[]) {
    this.dirPath = join(this.root, ...paths);
    this.contents = readdirSync(this.dirPath);
  }
}

export function testRoot(root: string, ...paths: string[]) {
  return new TestRoot(root, ...paths);
}
