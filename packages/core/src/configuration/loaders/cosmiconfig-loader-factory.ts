import { cosmiconfig, defaultLoaders } from 'cosmiconfig';
import { CheckupConfigFormat, CheckupConfigLoader } from '../../types';
import * as path from 'path';

type ConfigExtension = '.js' | '.json' | '.yml' | '.yaml';
const MODULE_NAME = 'checkup';
const EXTENSION_TO_FORMAT: Record<ConfigExtension, CheckupConfigFormat> = {
  '.js': CheckupConfigFormat.JavaScript,
  '.yml': CheckupConfigFormat.YAML,
  '.yaml': CheckupConfigFormat.YAML,
  '.json': CheckupConfigFormat.JSON,
};

/**
 * A factory function to get an instance of a {@link CheckupConfigLoader} that
 * uses {@link cosmiconfig#search} to get a {@link CheckupConfig} object
 * @param {string} basePath - the base path to start the config search in
 */
const cosmiConfigLoaderFactory: (basePath: string) => CheckupConfigLoader = (
  basePath: string
) => async () => {
  let outputFormat: CheckupConfigFormat | undefined;
  const maybeConfig = await cosmiconfig(MODULE_NAME, {
    searchPlaces: [
      `.${MODULE_NAME}rc`,
      `.${MODULE_NAME}rc.json`,
      `.${MODULE_NAME}rc.yaml`,
      `.${MODULE_NAME}rc.yml`,
      `.${MODULE_NAME}rc.js`,
      `${MODULE_NAME}.config.js`,
    ],
    loaders: {
      noExt(filepath, content) {
        try {
          JSON.parse(content);
          outputFormat = CheckupConfigFormat.JSON;
        } catch {
          outputFormat = CheckupConfigFormat.YAML;
        }
        return defaultLoaders['noExt'](filepath, content);
      },
    },
  }).search(basePath);

  if (maybeConfig === null) {
    throw new Error(
      `Could not find a checkup configuration starting from the given path: ${basePath}. See https://github.com/checkupjs/checkup/tree/master/packages/cli#configuration for more info on how to setup a configuration.`
    );
  }

  if (!outputFormat) {
    const extension = path.extname(maybeConfig.filepath) as ConfigExtension;
    outputFormat = EXTENSION_TO_FORMAT[extension];
  }

  return {
    config: maybeConfig.config,
    format: outputFormat,
    filepath: maybeConfig.filepath,
  };
};

export default cosmiConfigLoaderFactory;
