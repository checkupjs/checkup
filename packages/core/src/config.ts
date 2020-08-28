import * as Ajv from 'ajv';

import { existsSync, readJsonSync, writeJsonSync } from 'fs-extra';
import { join, resolve } from 'path';

import { CheckupConfig, ConfigValue } from './types/config';
import CheckupError from './errors/checkup-error';
import { white } from 'chalk';
import { normalizePackageName } from './utils/plugin-name';

const debug = require('debug')('checkup:config');
const schema = require('./schemas/config-schema.json');

export const CONFIG_DOCS_URL =
  'https://docs.checkupjs.com/quickstart/usage#1-generate-a-configuration-file';

export const CONFIG_SCHEMA_URL =
  'https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/config/config-schema.json';

export const DEFAULT_CONFIG: CheckupConfig = {
  $schema: CONFIG_SCHEMA_URL,
  excludePaths: [],
  plugins: [],
  tasks: {},
};

export function getConfigPath(path: string = '') {
  return join(resolve(path), '.checkuprc');
}

export function readConfig(configPath: string) {
  let config: CheckupConfig;

  debug(`Reading config from ${configPath}`);

  try {
    config = readJsonSync(resolve(configPath || getConfigPath()));
  } catch (error) {
    if (error instanceof SyntaxError) {
      let hint = error.message.replace(/.*:\s(.*)/, '$1');

      throw new CheckupError(
        `The checkup config at ${configPath} contains invalid JSON.\nError: ${hint}`,
        'Fix the syntax error in your .checkuprc before continuing.'
      );
    }

    throw new CheckupError(
      `Could not find a checkup config in the given path: ${configPath}.`,
      `See ${CONFIG_DOCS_URL} for more info on how to setup a config.`
    );
  }

  debug(`Found config %O`, config);

  config.plugins.forEach((pluginName, index, arr) => {
    arr[index] = normalizePackageName(pluginName);
  });

  validateConfig(config, configPath);

  return config;
}

export function mergeConfig(config: Partial<CheckupConfig>) {
  return { ...DEFAULT_CONFIG, ...config };
}

export function writeConfig(dir: string, config: Partial<CheckupConfig> = {}) {
  let path = getConfigPath(dir);

  if (existsSync(path)) {
    throw new Error(`There is already an existing config in ${dir}`);
  }

  try {
    writeJsonSync(path, mergeConfig(config), { spaces: 2 });
  } catch {
    throw new Error(`Cannot write config to ${dir}.`);
  }

  return path;
}

export function validateConfig(config: CheckupConfig, configPath: string) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  if (!validate(config)) {
    let error = `\n\n${white.bold('Details')}: ${
      (validate.errors && validate.errors.length > 0 && ajv.errorsText(validate.errors)) || ''
    }.`;

    throw new CheckupError(
      `Config in ${configPath} is invalid.${error}`,
      `See ${CONFIG_DOCS_URL} for more information on correct config formats.`
    );
  }
}

export function parseConfigTuple<T>(configValue: ConfigValue<T> | undefined): [boolean, T] {
  let enabled: boolean = true;
  let value: T = {} as T;

  if (typeof configValue === 'string') {
    enabled = configValue === 'on';
  } else if (Array.isArray(configValue)) {
    let [enabledStr, val] = configValue;
    enabled = enabledStr === 'on';
    value = val;
  }

  return [enabled, value];
}
