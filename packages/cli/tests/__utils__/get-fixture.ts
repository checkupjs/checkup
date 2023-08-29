import { isAbsolute, resolve } from 'path';
import fs from 'fs-extra';
import { dirname } from '@checkup/core';

export function getFixture(fixturePath: string) {
  let path: string = isAbsolute(fixturePath)
    ? fixturePath
    : resolve(dirname(import.meta), '..', '__fixtures__', fixturePath);

  return fs.readJsonSync(path);
}
