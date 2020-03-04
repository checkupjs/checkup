import { CheckupConfig, CheckupConfigFormat, CheckupConfigLoader, ConfigMapper } from '../types';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { RuntimeCheckupConfig } from '../types/runtime-types';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/Either';

/**
 * A service to interact with a {@link CheckupConfig}. Create an instance via
 * the factory function {@link CheckupConfigService#load}
 */
export default class CheckupConfigService {
  private static readonly formatToWriteMapper: Record<
    CheckupConfigFormat,
    (config: CheckupConfig) => string
  > = {
    JSON: config => JSON.stringify(config, null, 2),
    YAML: config => yaml.safeDump(config),
    JavaScript: config => `module.exports = ${JSON.stringify(config, null, 2)}`,
  };
  private readonly configPath: string;
  private readonly format: CheckupConfigFormat;
  private config: CheckupConfig;
  private mappers: ConfigMapper[];

  static async load(loader: CheckupConfigLoader) {
    const { config, filepath, format } = await loader();
    return new CheckupConfigService(config, filepath, format);
  }

  /**
   * Lazily apply a series of {@link ConfigMapper}s over the internal {@link CheckupConfig}
   * object. Note that the mappers are applied lazily, only applied during a
   * {@link CheckupConfigService#write} or {@link CheckupConfigService#get})
   * @param {ConfigMapper[]} mappers - the mappers to apply to internal config
   */
  map(...mappers: ConfigMapper[]) {
    this.mappers.push(...mappers);
    return this;
  }

  /**
   * Validate and get the internal {@link CheckupConfig} object. Will throw
   * if the config is not valid.
   */
  get() {
    this.config = this.mappers.reduce((config, mapper) => mapper(config), this.config);
    this.mappers = [];
    this.validate();
    return this.config;
  }

  /**
   * Write the internal {@link CheckupConfig} object to {@link configPath}
   */
  write() {
    const configToWrite = CheckupConfigService.formatToWriteMapper[this.format](this.get());
    fs.writeFileSync(this.configPath, configToWrite);
  }

  /**
   * Validate that the internal config object conforms to the {@link CheckupConfig}
   * schema
   */
  private validate() {
    return pipe(
      RuntimeCheckupConfig.decode(this.config),
      fold(
        errors => {
          const errorString = errors
            .map(error => error.context)
            .map(
              contexts =>
                `${contexts
                  .map(context => context.key)
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
    this.mappers = [];
  }
}
