import * as yargs from 'yargs';
import * as ora from 'ora';
import { OutputFormat } from '@checkup/core';

import RunCommand from './api/run';
import GenerateCommand from './api/generate';

export async function run(argv: string[] = process.argv.slice(2)) {
  let parser = yargs
    .scriptName('checkup')
    .usage(
      `
A health checkup for your project ✅

checkup <command> [options]`
    )
    .command({
      command: 'run <paths> [options]',
      aliases: ['r'],
      describe: 'Runs configured checkup tasks',
      builder: (yargs) => {
        return yargs
          .positional('paths', {
            description: 'The paths or globs that checkup will operate on.',
            required: true,
          })
          .options({
            'exclude-paths': {
              alias: 'e',
              description:
                'Paths to exclude from checkup. If paths are provided via command line and via checkup config, command line paths will be used.',
              multiple: true,
            },

            config: {
              alias: 'c',
              description: 'Use this configuration, overriding .checkuprc if present.',
            },

            cwd: {
              alias: 'd',
              description: 'The path referring to the root directory that Checkup will run in',
              default: () => process.cwd(),
            },

            category: {
              description: 'Runs specific tasks specified by category. Can be used multiple times.',
              multiple: true,
              exclusive: ['group', 'task'],
            },

            group: {
              description: 'Runs specific tasks specified by group. Can be used multiple times.',
              multiple: true,
              exclusive: ['category', 'task'],
            },

            task: {
              alias: 't',
              description:
                'Runs specific tasks specified by the fully qualified task name in the format pluginName/taskName. Can be used multiple times.',
              multiple: true,
              exclusive: ['category', 'group'],
            },

            format: {
              alias: 'f',
              options: [...Object.values(OutputFormat)],
              default: 'stdout',
              description: `The output format, one of ${[...Object.values(OutputFormat)].join(
                ', '
              )}`,
            },

            'output-file': {
              alias: 'o',
              default: '',
              description:
                'Specify file to write JSON output to. Requires the `--format` flag to be set to `json`',
            },

            'list-tasks': {
              alias: 'l',
              description: 'List all available tasks to run.',
              boolean: true,
            },
          });
      },
      handler: async (argv: yargs.Arguments) => {
        let cmd = new RunCommand(argv);
        let spinner = ora().start('🕵️‍♀️ Checking up on your project');

        await cmd.run();

        spinner.stop();
      },
    })
    .command({
      command: 'generate <generator> <name> [options]',
      aliases: ['g'],
      describe: 'Runs a generator to scaffold Checkup code',
      builder: (yargs) => {
        return yargs
          .positional('type', {
            description: 'Type of generator to run',
            choices: ['config', 'plugin', 'task', 'actions'],
            required: true,
          })
          .positional('name', {
            description: 'Name of the entity (kebab-case)',
            require: false,
          })
          .options({
            defaults: {
              alias: 'd',
              description: 'Use defaults for every setting',
              boolean: true,
            },
            force: {
              description: 'Overwrite existing files',
              boolean: true,
            },
            path: {
              alias: 'p',
              default: '.',
              description: 'The path referring to the directory that the generator will run in',
            },
          });
      },
      handler: async (argv: yargs.Arguments) => {
        let cmd = new GenerateCommand(argv);

        await cmd.run();
      },
    })
    .wrap(yargs.terminalWidth())
    .help()
    .version();

  if (argv.length === 0) {
    parser.showHelp();
  } else {
    parser.parse(argv);
  }
}
