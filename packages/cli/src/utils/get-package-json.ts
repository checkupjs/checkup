import { resolve, join } from 'path';
import { readJsonSync } from 'fs-extra';
import { PackageJson } from 'type-fest';

/**
 * @param basePath
 */
export function getPackageJson(basePath: string, pathName: string = 'package.json'): PackageJson {
  let package_ = {};
  let packageJsonPath = join(resolve(basePath), pathName);

  try {
    package_ = readJsonSync(packageJsonPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `The ${resolve(
          basePath
        )} directory found through the 'path' option does not contain a package.json file. You must run checkup in a directory with a package.json file.`
      );
    }
  }

  return package_;
}
