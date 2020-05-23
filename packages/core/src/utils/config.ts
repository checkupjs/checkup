import { existsSync, readJsonSync, writeJsonSync } from 'fs-extra';
import { join, resolve } from 'path';

import { CheckupConfig } from '../types/config';

const debug = require('debug')('checkup:config');

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
    throw new Error(`Could not locate a Checkup config in ${configPath}`);
  }

  debug(`Found config %o`, config);

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
    throw new Error(`Cannot write Checkup config to ${dir}. ${error.message}`);
  }

  return path;
}
