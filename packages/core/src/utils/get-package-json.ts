import * as fs from 'fs-extra';
import * as path from 'path';

import { PackageJson } from 'type-fest';

export function getPackageJson(basePath: string): PackageJson {
  let pkg: PackageJson = {};
  let packageJsonPath = path.join(path.resolve(basePath), 'package.json');

  try {
    pkg = fs.readJsonSync(packageJsonPath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new Error(`No package.json file detected at ${packageJsonPath}`);
    }
  }

  return pkg;
}
