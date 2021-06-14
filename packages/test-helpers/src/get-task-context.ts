import {
  CheckupConfig,
  FilePathArray,
  TaskContext,
  RunOptions,
  CheckupLogBuilder,
  CONFIG_SCHEMA_URL,
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

  let taskContext = {
    options: opts,
    config: c,
    logBuilder: new CheckupLogBuilder({
      analyzedPackageJson: {
        name: pkg.name ?? '',
        version: pkg.version ?? '',
      },
      options: opts,
    }),
    pkg: pkg,
    pkgSource: JSON.stringify(pkg, null, 2),
    paths: paths,
  };

  taskContext.logBuilder.config;
  taskContext.logBuilder.actions = [];
  taskContext.logBuilder.errors = [];
  taskContext.logBuilder.timings = {};

  return taskContext;
}
