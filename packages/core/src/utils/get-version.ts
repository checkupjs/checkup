import { join } from 'path';

/**
 * Gets the version from the package.json file.
 *
 * @param {string} [cwd] - The optional current working directory
 * @param {string} [fakeVersion='0.0.0'] - An optional fake version (used for testing)
 * @returns {*}
 */
export function getVersion(cwd?: string, fakeVersion: string = '0.0.0') {
  if (process.env.JEST_WORKER_ID !== undefined) {
    return fakeVersion;
  }

  let packagePath = join(cwd ?? '../..', 'package.json');

  return require(packagePath).version;
}
