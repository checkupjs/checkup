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

export function getTaskContext({
  cliArguments = [] as [],
  cliFlags = DEFAULT_FLAGS as {},
  config = DEFAULT_CONFIG as {},
  pkg = DEFAULT_PACKAGE_JSON as PackageJson,
  paths = [] as string[],
} = {}): TaskContext {
  return {
    cliArguments,
    cliFlags: Object.assign({}, DEFAULT_FLAGS, cliFlags),
    parsers: getRegisteredParsers(),
    config: Object.assign({}, DEFAULT_CONFIG, config),
    pkg: pkg,
    paths: paths,
  };
}
