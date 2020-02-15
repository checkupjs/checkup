import * as fs from 'fs-extra';
import * as path from 'path';

import { PackageJson } from 'type-fest';

let pkg: PackageJson;

export function getPackageJson(): PackageJson {
  if (pkg === undefined) {
    pkg = fs.readJsonSync(path.join(process.cwd(), 'package.json'));
  }

  return pkg;
}
