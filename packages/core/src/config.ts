import { join, resolve } from 'path';
import * as crypto from 'crypto';
import { createRequire } from 'module';
import * as Ajv from 'ajv';
import fetch from 'node-fetch';
import * as tmp from 'tmp';
import * as stringify from 'json-stable-stringify';
import fs from 'fs-extra';
import createDebug from 'debug';

import chalk from 'chalk';
import { CheckupConfig, ConfigValue } from './types/config.js';
import CheckupError from './errors/checkup-error.js';
import { normalizePackageName } from './utils/normalize-package-name.js';
import { ErrorKind } from './errors/error-kind.js';

const require = createRequire(import.meta.url);
const { existsSync, readJsonSync, writeJsonSync, writeJSON } = fs;
const debug = createDebug('checkup:config');
const schema = require('./schemas/config-schema.json');

export const CONFIG_DOCS_URL =
  'https://docs.checkupjs.com/quickstart/usage#1-generate-a-configuration-file';

export const CONFIG_SCHEMA_URL =
  'https://raw.githubusercontent.com/checkupjs/checkup/master/packages/core/src/schemas/config-schema.json';

export const DEFAULT_CONFIG: CheckupConfig = {
  $schema: CONFIG_SCHEMA_URL,
  excludePaths: [],
  plugins: [],
  tasks: {},
};

export function resolveConfigPath(cwd: string = '', configPath: string = '.checkuprc') {
  return join(resolve(cwd), configPath);
}

export async function getConfigPath(configPath: string | undefined, cwd: string = '') {
  if (configPath && configPath.startsWith('http')) {
    const contents = await downloadFile(configPath);
    const filePath = tmp.fileSync();

    await writeJSON(filePath.name, contents);

    return filePath.name;
  } else {
    return resolveConfigPath(cwd, configPath);
  }
}

async function downloadFile(url: string) {
  let response = await fetch(url);

  return response.json();
}

export function readConfig(configPath: string) {
  let config: CheckupConfig;

  debug(`Reading config from ${configPath}`);

  try {
    config = readJsonSync(resolve(configPath));
  } catch (error) {
    if (error instanceof SyntaxError) {
      let hint = error.message.replace(/.*:\s(.*)/, '$1');

      throw new CheckupError(ErrorKind.ConfigInvalidSyntax, { configPath, hint });
    }

    debug('Falling back to default config %O', DEFAULT_CONFIG);

    config = DEFAULT_CONFIG;
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
  let path = resolveConfigPath(dir);

  if (existsSync(path)) {
    throw new CheckupError(ErrorKind.ConfigFileExists, {
      configDestination: dir,
    });
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
    let hint = `\n\n${chalk.white.bold('Details')}: ${
      (validate.errors && validate.errors.length > 0 && ajv.errorsText(validate.errors)) || ''
    }.`;

    throw new CheckupError(ErrorKind.ConfigInvalidSchema, {
      configPath,
      hint,
      docsUrl: CONFIG_DOCS_URL,
    });
  }
}

export function parseConfigTuple<T extends object>(
  configValue: ConfigValue<T> | undefined
): [boolean, T] {
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

export function getConfigHash(checkupConfig: CheckupConfig) {
  let configAsJson = stringify(checkupConfig);

  return crypto.createHash('md5').update(configAsJson).digest('hex');
}
