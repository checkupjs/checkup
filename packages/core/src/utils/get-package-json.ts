import { resolve, join } from 'path';
import { readFileSync } from 'fs-extra';
import { PackageJson } from 'type-fest';

export function getPackageJsonSource(baseDir: string, pathName: string = 'package.json'): string {
  let source: string = '';
  let packageJsonPath = join(resolve(baseDir), pathName);

  try {
    source = readFileSync(packageJsonPath, { encoding: 'utf-8' });
  } catch (error) {
    if (error.code === 'ENOENT') {
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
 * @param baseDir
 */
export function getPackageJson(baseDir: string, pathName: string = 'package.json'): PackageJson {
  return JSON.parse(getPackageJsonSource(baseDir, pathName));
}
