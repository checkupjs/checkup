import { cosmiconfig } from 'cosmiconfig';
import { CheckupConfig } from '../types';

/**
 * Get the checkup config via {@link cosmiconfig#search}
 * @param {string} basePath - the base path to start the config search
 * @return {Promise<CheckupConfig>} the parsed config file, if found, else throw
 */
export async function getConfig(basePath: string): Promise<CheckupConfig> {
  const configResult = await cosmiconfig('checkup').search(basePath);

  if (configResult === null) {
    throw new Error(
      `Could not find a checkup configuration starting from the given path: ${basePath}. See https://github.com/checkupjs/checkup/tree/master/packages/cli#configuration for more info on how to setup a configuration.`
    );
  }

  return configResult.config;
}
