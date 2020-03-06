import { CheckupConfigLoader } from '../../types';
import CosmiconfigService from '../cosmiconfig-service';

/**
 * A function to get an instance of a {@link CheckupConfigLoader} that
 * uses {@link cosmiconfig#load} to get a {@link CheckupConfig} object
 * at the given filepath
 *
 * @param {string} filepath - the file path to the config file
 * @returns {CheckupConfigLoader} - a loader that loads the config at the given
 * filepath
 */
const getFilepathLoader: (filepath: string) => CheckupConfigLoader = (
  filepath: string
) => async () => {
  let maybeConfig;
  try {
    maybeConfig = await new CosmiconfigService().load(filepath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Could not find checkup configuration file at ${filepath}`);
    }
    throw error;
  }

  if (maybeConfig === null) {
    throw new Error(
      `Could not find a checkup configuration at: ${filepath}. See https://github.com/checkupjs/checkup/tree/master/packages/cli#configuration for more info on how to setup a configuration.`
    );
  }

  return maybeConfig;
};

export default getFilepathLoader;
