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
  let packageJson: PackageJson = readJsonSync(sync({ cwd })!);

  return packageJson.name!;
}
