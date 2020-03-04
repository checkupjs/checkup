import { cosmiconfig, defaultLoaders } from 'cosmiconfig';
import * as path from 'path';
import { CheckupConfigFormat, CosmiconfigServiceResult } from '../types';

type ConfigExtension = '.js' | '.json' | '.yml' | '.yaml';
const EXTENSION_TO_FORMAT: Record<ConfigExtension, CheckupConfigFormat> = {
  '.js': CheckupConfigFormat.JavaScript,
  '.yml': CheckupConfigFormat.YAML,
  '.yaml': CheckupConfigFormat.YAML,
  '.json': CheckupConfigFormat.JSON,
};

/**
 * A service that decorates the behavior of {@link cosmiconfig} to get additional
 * data from the loaded config, like {@link CheckupConfigFormat}.
 */
export default class CosmiconfigService {
  private static readonly MODULE_NAME = 'checkup';
  private cosmiconfig: ReturnType<typeof cosmiconfig>;
  private outputFormat: CheckupConfigFormat | undefined;

  constructor() {
    this.cosmiconfig = cosmiconfig(CosmiconfigService.MODULE_NAME, {
      searchPlaces: [
        `.${CosmiconfigService.MODULE_NAME}rc`,
        `.${CosmiconfigService.MODULE_NAME}rc.json`,
        `.${CosmiconfigService.MODULE_NAME}rc.yaml`,
        `.${CosmiconfigService.MODULE_NAME}rc.yml`,
        `.${CosmiconfigService.MODULE_NAME}rc.js`,
        `${CosmiconfigService.MODULE_NAME}.config.js`,
      ],
      loaders: {
        noExt: (filepath, content) => {
          try {
            JSON.parse(content);
            this.outputFormat = CheckupConfigFormat.JSON;
          } catch {
            this.outputFormat = CheckupConfigFormat.YAML;
          }
          return defaultLoaders['noExt'](filepath, content);
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
