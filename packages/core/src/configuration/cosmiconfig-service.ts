import * as path from 'path';

import { CheckupConfigFormat, CosmiconfigServiceResult } from '../types/configuration';
import { cosmiconfig, defaultLoaders } from 'cosmiconfig';

type ConfigExtension = '.js' | '.json';
const EXTENSION_TO_FORMAT: Record<ConfigExtension, CheckupConfigFormat> = {
  '.js': CheckupConfigFormat.JavaScript,
  '.json': CheckupConfigFormat.JSON,
};

/**
 * A service that decorates the behavior of {@link cosmiconfig} to get additional
 * data from the loaded config, like {@link CheckupConfigFormat}.
 */
export default class CosmiconfigService {
  private cosmiconfig: ReturnType<typeof cosmiconfig>;
  private outputFormat: CheckupConfigFormat | undefined;

  constructor() {
    this.cosmiconfig = cosmiconfig('checkup', {
      searchPlaces: ['.checkuprc', '.checkuprc.json', '.checkuprc.js', 'checkup.config.js'],
      loaders: {
        noExt: (filepath, content) => {
          try {
            JSON.parse(content);
            this.outputFormat = CheckupConfigFormat.JSON;
            return defaultLoaders['.json'](filepath, content);
          } catch {
            this.outputFormat = CheckupConfigFormat.JavaScript;
            return defaultLoaders['.js'](filepath, content);
          }
        },
      },
    });
  }

  /**
   * Search for a config file starting from the given basedir
   * @param {string} basedir - the base directory to start the config search in
   * @return {Promise<CosmiconfigServiceResult>} {@link CosmiconfigServiceResult}
   * if a config is found, else null
   */
  async search(basedir: string): Promise<CosmiconfigServiceResult> {
    const maybeConfig = await this.cosmiconfig.search(basedir);

    if (maybeConfig === null) {
      return null;
    }

    if (this.outputFormat === undefined) {
      const extension = path.extname(maybeConfig.filepath) as ConfigExtension;
      this.outputFormat = EXTENSION_TO_FORMAT[extension];
    }

    return {
      config: maybeConfig.config,
      filepath: maybeConfig.filepath,
      format: this.outputFormat,
    };
  }

  /**
   * Load a config from the given filepath
   * @param {string} filepath - path to the config file to load
   * @return {Promise<CosmiconfigServiceResult>} {@link CosmiconfigServiceResult}
   * if a config is found, else null
   */
  async load(filepath: string): Promise<CosmiconfigServiceResult> {
    const maybeConfig = await this.cosmiconfig.load(filepath);

    if (maybeConfig === null) {
      return null;
    }

    if (this.outputFormat === undefined) {
      const extension = path.extname(maybeConfig.filepath) as ConfigExtension;
      this.outputFormat = EXTENSION_TO_FORMAT[extension];
    }

    return {
      config: maybeConfig.config,
      filepath: maybeConfig.filepath,
      format: this.outputFormat,
    };
  }
}
