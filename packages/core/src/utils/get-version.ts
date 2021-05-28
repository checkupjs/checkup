import { join } from 'path';

export function getVersion(cwd: string, fakeVersion: string = '0.0.0') {
  if (process.env.JEST_WORKER_ID !== undefined) {
    return fakeVersion;
  }

  return require(join(cwd, 'package.json'));
}
