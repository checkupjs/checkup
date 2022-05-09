import { resolve, join } from 'path';
import { readFileSync } from 'fs-extra';
import { PackageJson } from 'type-fest';
import { isErrnoException } from './type-guards';

/**
 * Gets the package.json source
 *
 * @param {string} baseDir - The base directory
 * @param {string} [pathName='package.json'] - The path to the package.json file
 * @returns {string} - The package.json source
 */
export function getPackageJsonSource(baseDir: string, pathName: string = 'package.json'): string {
  let source: string = '';
  let packageJsonPath = join(resolve(baseDir), pathName);

  try {
    source = readFileSync(packageJsonPath, { encoding: 'utf-8' });
  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === 'ENOENT') {
      throw new Error(
        `The ${resolve(
          baseDir
        )} directory found through the 'cwd' option does not contain a package.json file. You must run checkup in a directory with a package.json file.`
      );
    }
  }

  return source;
}

/**
 * Gets the package.json file as an object
 *
 * @param {string} baseDir - The base directory
 * @param {string} [pathName='package.json'] - The path to the package.json file
 * @returns {PackageJson} - An object representing the package.json contents
 */
export function getPackageJson(baseDir: string, pathName: string = 'package.json'): PackageJson {
  return JSON.parse(getPackageJsonSource(baseDir, pathName));
}
