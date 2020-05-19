import { TaskContext, getRegisteredParsers } from '@checkup/core';

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

export function getTaskContext(
  cliArguments: {} = {},
  cliFlags: {} = DEFAULT_FLAGS,
  config: {} = DEFAULT_CONFIG
): TaskContext {
  return {
    cliArguments,
    cliFlags: Object.assign({}, DEFAULT_FLAGS, cliFlags),
    parsers: getRegisteredParsers(),
    config: Object.assign({}, DEFAULT_CONFIG, config),
  };
}
