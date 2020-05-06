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
      throw new Error(`No package.json file detected at ${packageJsonPath}`);
    }
  }

  return package_;
}
