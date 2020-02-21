import * as fs from 'fs-extra';
import * as path from 'path';

import { PackageJson } from 'type-fest';

let pkg: PackageJson;

export function getPackageJson(basePath: string): PackageJson {
  if (pkg === undefined) {
    pkg = fs.readJsonSync(path.join(path.resolve(basePath), 'package.json'));
  }

  return pkg;
}
