import { flags } from '@oclif/command';
import { OutputFormat } from '@checkup/core';

export const excludePaths = flags.string({
  description:
    'Paths to exclude from checkup. If paths are provided via command line and via checkup config, command line paths will be used.',
  char: 'e',
  multiple: true,
});

export const config = flags.string({
  char: 'c',
  description: 'Use this configuration, overriding .checkuprc.* if present.',
});

export const cwd = flags.string({
  default: () => process.cwd(),
  char: 'd',
  description: 'The path referring to the root directory that Checkup will run in',
});

export const category = flags.string({
  description: 'Runs specific tasks specified by category. Can be used multiple times.',
  multiple: true,
  exclusive: ['group', 'task'],
});

export const group = flags.string({
  description: 'Runs specific tasks specified by group. Can be used multiple times.',
  multiple: true,
  exclusive: ['category', 'task'],
});

export const task = flags.string({
  char: 't',
  description:
    'Runs specific tasks specified by the fully qualified task name in the format pluginName/taskName. Can be used multiple times.',
  multiple: true,
  exclusive: ['category', 'group'],
});

export const format = flags.string({
  char: 'f',
  options: [...Object.values(OutputFormat)],
  default: 'stdout',
  description: `The output format, one of ${[...Object.values(OutputFormat)].join(', ')}`,
});

export const outputFile = flags.string({
  char: 'o',
  default: '',
  description:
    'Specify file to write JSON output to. Requires the `--format` flag to be set to `json`',
});

export const listTasks = flags.boolean({
  char: 'l',

  description: 'List all available tasks to run.',
});
