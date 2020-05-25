import * as Config from '@oclif/config';
import * as resolve from 'resolve';

import { CheckupError } from '..';

const FAILED_PLUGIN_LOAD_PATTERN = /Cannot\sfind\smodule\s'([^']*)'/;

/**
 * Given a list of oclif plugin names, attempt to resolve the plugins and load
 * them. Note: in order to use the plugins during an oclif command, the loaded
 * plugins must be pushed onto the oclif config plugins array.
 *
 * @param {string[]} pluginNames - plugin names to load
 * @param {string} resolutionBaseDirectory - the base directory to resolve plugins from
 * @returns {Promise<Config.Plugin[]>} Promise containing the loaded plugins
 */
export async function loadPlugins(
  pluginNames: string[],
  resolutionBaseDirectory: string
): Promise<Config.Plugin[]> {
  try {
    const plugins = pluginNames
      .map((pluginName) => resolve.sync(pluginName, { basedir: resolutionBaseDirectory }))
      .map((pluginPath) => new Config.Plugin({ root: pluginPath, type: 'core' }));

    await Promise.all(plugins.map((plugin) => plugin.load()));

    return plugins;
  } catch (error) {
    if (error.message.includes('Cannot find module')) {
      let pluginName;
      let pluginNameFound = (error.message as string).match(FAILED_PLUGIN_LOAD_PATTERN);

      if (pluginNameFound) {
        pluginName = pluginNameFound[1];
      }

      throw new CheckupError(
        `Failed to load plugin '${pluginName}'.`,
        `Make sure your config file includes '${pluginName}' in the plugins array, and that you've installed the package containing this plugin in your project.`
      );
    } else {
      throw error;
    }
  }
}
