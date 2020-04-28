import * as debug from 'debug';
import * as fs from 'fs';

import { CheckupConfig, CheckupConfigFormat, CheckupConfigLoader } from '../types/configuration';

import { RuntimeCheckupConfig } from '../types/runtime-types';
import { basename } from 'path';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

/**
 * A service to interact with a {@link CheckupConfig}. Create an instance via
 * the factory function {@link CheckupConfigService#load}
 */
export default class CheckupConfigService {
  private static readonly formatToWriteMapper: Record<
    CheckupConfigFormat,
    (config: CheckupConfig) => string
  > = {
    JSON: (config) => JSON.stringify(config, null, 2),
    JavaScript: (config) => `module.exports = ${JSON.stringify(config, null, 2)}`,
  };
  private readonly configPath: string;
  private readonly format: CheckupConfigFormat;
  private config: CheckupConfig;

  static async load(loader: CheckupConfigLoader) {
    const { config, filepath, format } = await loader();
    return new CheckupConfigService(config, filepath, format);
  }

  /**
   * Validate and get the internal {@link CheckupConfig} object. Will throw
   * if the config is not valid.
   */
  get() {
    this.validate();
    debug('checkup:config')('%j', this.config);
    return this.config;
  }

  /**
   * Write the internal {@link CheckupConfig} object to {@link configPath}
   */
  write() {
    const configToWrite = CheckupConfigService.formatToWriteMapper[this.format](this.get());
    fs.writeFileSync(this.configPath, configToWrite);

    return basename(this.configPath);
  }

  /**
   * Validate that the internal config object conforms to the {@link CheckupConfig}
   * schema
   */
  private validate() {
    return pipe(
      RuntimeCheckupConfig.decode(this.config),
      fold(
        (errors) => {
          const errorString = errors
            .map((error) => error.context)
            .map(
              (contexts) =>
                `${contexts
                  .map((context) => context.key)
                  .filter(Boolean)
                  .join('.')} expected type ${
                  contexts.slice(-1)[0].type.name
                }, but got ${JSON.stringify(contexts.slice(-1)[0].actual)}`
            )
            .join('\n');
          throw new Error(`Checkup configuration is malformed:\n${errorString}`);
        },
        () => ['no errors']
      )
    );
  }

  private constructor(config: CheckupConfig, configPath: string, format: CheckupConfigFormat) {
    this.config = config;
    this.configPath = configPath;
    this.format = format;
  }
}
