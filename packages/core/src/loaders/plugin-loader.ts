import * as Config from '@oclif/config';
import * as resolve from 'resolve';

/**
 * Given a list of oclif plugin names, attempt to resolve the plugins and load
 * them. Note: in order to use the plugins during an oclif command, the loaded
 * plugins must be pushed onto the oclif config plugins array.
 * @param {string[]} pluginNames - plugin names to load
 * @param {string} resolutionBaseDirectory - the base directory to resolve plugins from
 * @return {Promise<Config.Plugin[]>} Promise containing the loaded plugins
 */
export async function loadPlugins(pluginNames: string[], resolutionBaseDirectory: string) {
  const plugins = pluginNames
    .map(pluginName => resolve.sync(pluginName, { basedir: resolutionBaseDirectory }))
    .map(pluginPath => new Config.Plugin({ root: pluginPath, type: 'core' }));

  await Promise.all(plugins.map(plugin => plugin.load()));

  return plugins;
}
