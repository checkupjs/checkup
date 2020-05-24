import * as Ajv from 'ajv';

import { existsSync, readJsonSync, writeJsonSync } from 'fs-extra';
import { join, resolve } from 'path';

import { CheckupConfig } from '../types/config';

const debug = require('debug')('checkup:config');
const schema = require('./config-schema.json');

const ajv = new Ajv();
const validate = ajv.compile(schema);

export const CONFIG_DOCS_URL =
  'https://docs.checkupjs.com/quickstart/usage#1-generate-a-configuration-file';

export const DEFAULT_CONFIG: CheckupConfig = {
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
    throw new Error(
      `Could not find a checkup config starting from the given path: ${configPath}.
See ${CONFIG_DOCS_URL} for more info on how to setup a configuration.`
    );
  }

  debug(`Found config %o`, config);

  validateConfig(config, configPath);

  return config;
}

export function mergeConfig(config: Partial<CheckupConfig>) {
  return { ...DEFAULT_CONFIG, ...config };
}

export function writeConfig(dir: string, config: Partial<CheckupConfig> = {}) {
  let path = getConfigPath(dir);

  if (existsSync(path)) {
    throw new Error(`There is already an existing Checkup config in ${dir}`);
  }

  try {
    writeJsonSync(path, mergeConfig(config), { spaces: 2 });
  } catch (error) {
    throw new Error(`Cannot write Checkup config to ${dir}.`);
  }

  return path;
}

export function validateConfig(config: CheckupConfig, configPath: string) {
  if (!validate(config)) {
    throw new Error(
      `Checkup config in ${configPath} is invalid.
See ${CONFIG_DOCS_URL} to ensure the format is correct.`
    );
  }
}
