import * as Config from '@oclif/config';

/**
 * Given a list of oclif plugin names, attempt to resolve the plugins and load
 * them. Note: in order to use the plugins during an oclif command, the loaded
 * plugins must be pushed onto the oclif config plugins array.
 * @param pluginNames - plugin names to load
 * @return Promise containing the loaded plugins
 */
export async function loadPlugins(pluginNames: string[]) {
  const plugins = pluginNames
    .map(pluginName => require.resolve(pluginName, { paths: [process.cwd()] }))
    .map(pluginPath => new Config.Plugin({ root: pluginPath, type: 'core' }));

  await Promise.all(plugins.map(plugin => plugin.load()));

  return plugins;
}
