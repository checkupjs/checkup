import { PackageJson } from 'type-fest';
import fs from 'fs-extra';
import { sync } from 'pkg-up';

/**
 * When inside a checkup plugin, gets the plugin's name.
 *
 * @param {string} cwd - The current working directory from which to find the plugin's name
 * @returns {*}  {string}
 */
export function getPluginName(cwd: string): string {
  let packageJsonPath = sync({ cwd });
  let packageJson: PackageJson = fs.readJsonSync(packageJsonPath!);

  if (!packageJson.keywords?.includes('checkup-plugin')) {
    throw new Error(
      `You tried to retrieve a pluginName from a package.json that isn't from a checkup plugin.
Path: ${packageJsonPath}`
    );
  }

  return packageJson.name!;
}
