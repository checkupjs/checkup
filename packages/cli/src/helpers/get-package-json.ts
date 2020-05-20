import * as fs from 'fs-extra';
import * as path from 'path';

import { PackageJson } from 'type-fest';

/**
 * @param basePath
 */
export function getPackageJson(basePath: string, pathName: string = 'package.json'): PackageJson {
  let package_ = {};
  let packageJsonPath = path.join(path.resolve(basePath), pathName);

  try {
    package_ = fs.readJsonSync(packageJsonPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `The ${path.resolve(
          basePath
        )} directory found through the 'path' option does not contain a package.json file. You must run checkup in a directory with a package.json file.`
      );
    }
  }

  return package_;
}
