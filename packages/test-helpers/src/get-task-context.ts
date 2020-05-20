import { TaskContext, getRegisteredParsers } from '@checkup/core';
import { PackageJson } from 'type-fest';

const DEFAULT_FLAGS = {
  version: undefined,
  help: undefined,
  config: undefined,
  cwd: '.',
  task: undefined,
  format: 'stdout',
  outputFile: '',
};

const DEFAULT_CONFIG = {
  plugins: [],
  tasks: {},
};

const DEFAULT_PACKAGE_JSON = {
  name: 'foo-project',
  version: '0.0.0',
  keywords: [],
};

export function getTaskContext(
  cliArguments: {} = {},
  cliFlags: {} = DEFAULT_FLAGS,
  config: {} = DEFAULT_CONFIG,
  pkg: PackageJson = DEFAULT_PACKAGE_JSON
): TaskContext {
  return {
    cliArguments,
    cliFlags: Object.assign({}, DEFAULT_FLAGS, cliFlags),
    parsers: getRegisteredParsers(),
    config: Object.assign({}, DEFAULT_CONFIG, config),
    pkg: pkg,
  };
}
