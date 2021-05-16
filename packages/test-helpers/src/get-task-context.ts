import {
  CheckupConfig,
  FilePathArray,
  TaskContext,
  RunOptions,
  ParserName,
  CreateParser,
  ParserOptions,
  Parser,
  ParserReport,
  createEslintParser,
  createEmberTemplateLintParser,
} from '@checkup/core';

import { PackageJson } from 'type-fest';
import { CONFIG_SCHEMA_URL } from '@checkup/core';

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

function getRegisteredParsers() {
  let registeredParsers: Map<
    ParserName,
    CreateParser<ParserOptions, Parser<ParserReport>>
  > = new Map<ParserName, CreateParser<ParserOptions, Parser<ParserReport>>>();
  registeredParsers.set('eslint', createEslintParser);
  registeredParsers.set('ember-template-lint', createEmberTemplateLintParser);

  return registeredParsers;
}

export function getTaskContext({
  options,
  config,
  pkg = DEFAULT_PACKAGE_JSON,
  paths = new FilePathArray(),
}: Partial<TaskContextArgs> = {}): TaskContext {
  return {
    options: Object.assign({}, DEFAULT_OPTIONS, options),
    parsers: getRegisteredParsers(),
    config: Object.assign({}, DEFAULT_CONFIG, config),
    pkg: pkg,
    // eslint-disable-next-line unicorn/no-null
    pkgSource: JSON.stringify(pkg, null, 2),
    paths: paths,
  };
}
