import { PackageJson } from 'type-fest';
import { readJsonSync } from 'fs-extra';
import { sync } from 'pkg-up';

const PLUGIN_NAME_PATTERN = /checkup-plugin-.*/;

export function toShortPluginName(pluginName: string) {
  return pluginName.replace('checkup-plugin-', '');
}

export function toFullPluginName(pluginName: string) {
  if (!PLUGIN_NAME_PATTERN.test(pluginName)) {
    return `checkup-plugin-${pluginName}`;
  }

  return pluginName;
}

export function getPluginName(cwd: string): string {
  let packageJsonPath = sync({ cwd });
  let packageJson: PackageJson = readJsonSync(packageJsonPath!);

  if (!packageJson.keywords?.includes('checkup-plugin')) {
    throw new Error(
      `You tried to retrieve a pluginName from a package.json that isn't from a checkup plugin.
Path: ${packageJsonPath}`
    );
  }

  return packageJson.name!;
}
