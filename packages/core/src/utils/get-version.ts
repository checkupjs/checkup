import { join } from 'path';

export function getVersion(cwd?: string, fakeVersion: string = '0.0.0') {
  if (process.env.JEST_WORKER_ID !== undefined) {
    return fakeVersion;
  }

  let packagePath = join(cwd ?? '../..', 'package.json');

  return require(packagePath).version;
}
