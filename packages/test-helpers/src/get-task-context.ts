import {
  CheckupConfig,
  FilePathArray,
  TaskContext,
  RunOptions,
  CheckupLogBuilder,
  CONFIG_SCHEMA_URL,
  TaskListError,
  Action,
} from '@checkup/core';

import { PackageJson } from 'type-fest';

type TaskContextArgs = {
  cliArguments: string[];
  options: Partial<RunOptions>;
  config: Partial<CheckupConfig>;
  pkg: PackageJson;
  paths: FilePathArray;
};

const DEFAULT_OPTIONS: RunOptions = {
  paths: ['.'],
  config: undefined,
  excludePaths: undefined,
  cwd: process.cwd(),
  categories: undefined,
  groups: undefined,
  tasks: undefined,
  listTasks: false,
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
  options,
  config,
  pkg = DEFAULT_PACKAGE_JSON,
  paths = new FilePathArray(),
}: Partial<TaskContextArgs> = {}): TaskContext {
  let opts = Object.assign({}, DEFAULT_OPTIONS, options) as RunOptions;
  let c = Object.assign({}, DEFAULT_CONFIG, config) as CheckupConfig;

  return {
    options: opts,
    config: c,
    logBuilder: new CheckupLogBuilder({
      packageName: pkg.name ?? '',
      packageVersion: pkg.version ?? '',
      config: c,
      options: opts,
      actions: [] as Action[],
      errors: [] as TaskListError[],
    }),
    pkg: pkg,
    pkgSource: JSON.stringify(pkg, null, 2),
    paths: paths,
  };
}
