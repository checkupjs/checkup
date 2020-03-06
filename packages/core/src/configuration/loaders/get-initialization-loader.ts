import { CheckupConfigFormat, CheckupConfigLoader } from '../../types';
import * as path from 'path';

/**
 * Get a config loader given a filepath and the config format. This loader should
 * be used when initializing a new config (i.e. not loading a config from disk).
 *
 * @param {string} basePath the base path of the config file
 * @param {CheckupConfigFormat} format the format of the config file
 * @returns {CheckupConfigLoader} the config loader
 */
const getInitializationConfigLoader: (
  basePath: string,
  format: CheckupConfigFormat
) => CheckupConfigLoader = (basePath, format) => async () => ({
  format: CheckupConfigFormat[format],
  config: {
    plugins: [],
    tasks: {},
  },
  filepath:
    format === CheckupConfigFormat.JavaScript
      ? path.join(basePath, '.checkuprc.js')
      : path.join(basePath, '.checkuprc'),
});

export default getInitializationConfigLoader;
