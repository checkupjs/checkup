import {
  TaskContext,
  getRegisteredParsers,
  RunFlags,
  CheckupConfig,
  FilePathsArray,
} from '@checkup/core';

import { PackageJson } from 'type-fest';
import { CONFIG_SCHEMA_URL } from '@checkup/core';

type TaskContextArgs = {
  cliArguments: string[];
  cliFlags: Partial<RunFlags>;
  config: Partial<CheckupConfig>;
  pkg: PackageJson;
  paths: FilePathsArray;
};

const DEFAULT_FLAGS: RunFlags = {
  version: undefined,
  help: undefined,
  config: undefined,
  excludePaths: undefined,
  cwd: '.',
  task: undefined,
  format: 'stdout',
  outputFile: '',
};

const DEFAULT_CONFIG: CheckupConfig = {
  $schema: CONFIG_SCHEMA_URL,
  excludePaths: [],
  plugins: [],
  tasks: {},
};

const DEFAULT_PACKAGE_JSON: PackageJson = {
  name: 'foo-project',
  version: '0.0.0',
  keywords: [],
};

export function getTaskContext({
  cliArguments = [],
  cliFlags,
  config,
  pkg = DEFAULT_PACKAGE_JSON,
  paths = new FilePathsArray(),
}: Partial<TaskContextArgs> = {}): TaskContext {
  return {
    cliArguments,
    cliFlags: Object.assign({}, DEFAULT_FLAGS, cliFlags),
    parsers: getRegisteredParsers(),
    config: Object.assign({}, DEFAULT_CONFIG, config),
    pkg: pkg,
    paths: paths,
  };
}
