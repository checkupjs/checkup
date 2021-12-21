import * as yargs from 'yargs';
import { OutputFormat, ConsoleWriter, CheckupConfig } from '@checkup/core';
import Generator from './api/generator';

import { runCommand } from './commands/run';

interface CheckupArguments {
  [x: string]: unknown;
  paths: string[];
  excludePaths: string[];
  config: CheckupConfig;
  configPath: string;
  cwd: string;
  category: string[];
  group: string[];
  task: string[];
  pluginBaseDir: string;
  listTasks: boolean;
  format: OutputFormat;
  outputFile: string;
}

export type CLIOptions = CheckupArguments & yargs.Arguments;

export const consoleWriter = new ConsoleWriter();

export async function run(argv: string[] = process.argv.slice(2)) {
  let parser = yargs
    .scriptName('checkup')
    .usage(
      `
A health checkup for your project ✅

checkup <command> [options]`
    )
    .command(runCommand)
    .command({
      command: 'generate',
      aliases: ['g'],
      describe: 'Runs a generator to scaffold Checkup code',
      builder: (yargs) => {
        return yargs
          .command({
            command: 'plugin <name> [options]',
            describe: 'Generates a checkup plugin project',
            builder: (yargs) => {
              return yargs
                .positional('name', {
                  description: 'Name of the plugin (eg. checkup-plugin-myplugin)',
                  default: '',
                })
                .options({
                  defaults: {
                    alias: 'd',
                    description: 'Use defaults for every setting',
                    boolean: true,
                  },
                  path: {
                    alias: 'p',
                    default: '.',
                    description:
                      'The path referring to the directory that the generator will run in',
                  },
                });
            },
            handler: async (argv: yargs.Arguments) => {
              let generator = new Generator({
                path: argv.path as string,
                generator: 'plugin',
                name: argv.name as string,
                defaults: argv.defaults as boolean,
              });
              await generator.run();
            },
          })
          .command({
            command: 'task <name> [options]',
            describe: 'Generates a checkup task within a project',
            builder: (yargs) => {
              return yargs
                .positional('name', {
                  description: 'Name of the task (foo-task)',
                  default: '',
                })
                .options({
                  defaults: {
                    alias: 'd',
                    description: 'Use defaults for every setting',
                    boolean: true,
                  },
                  path: {
                    alias: 'p',
                    default: '.',
                    description:
                      'The path referring to the directory that the generator will run in',
                  },
                });
            },
            handler: async (argv: yargs.Arguments) => {
              try {
                let generator = new Generator({
                  path: argv.path as string,
                  generator: 'task',
                  name: argv.name as string,
                  defaults: argv.defaults as boolean,
                });

                await generator.run();
              } catch (error) {
                consoleWriter.error(error);
              }
            },
          })
          .command({
            command: 'actions <name> [options]',
            describe: 'Generates checkup actions within a project',
            builder: (yargs) => {
              return yargs
                .positional('name', {
                  description: 'Name of the actions (foo-task-actions)',
                  default: '',
                })
                .options({
                  defaults: {
                    alias: 'd',
                    description: 'Use defaults for every setting',
                    boolean: true,
                  },
                  path: {
                    alias: 'p',
                    default: '.',
                    description:
                      'The path referring to the directory that the generator will run in',
                  },
                });
            },
            handler: async (argv: yargs.Arguments) => {
              try {
                let generator = new Generator({
                  path: argv.path as string,
                  generator: 'actions',
                  name: argv.name as string,
                  defaults: argv.defaults as boolean,
                });

                await generator.run();
              } catch (error) {
                consoleWriter.error(error);
              }
            },
          })
          .command({
            command: 'config',
            describe: 'Generates a .checkuprc within a project',
            builder: (yargs) => {
              return yargs.options({
                path: {
                  alias: 'p',
                  default: '.',
                  description: 'The path referring to the directory that the generator will run in',
                },
              });
            },
            handler: async (argv: yargs.Arguments) => {
              try {
                let generator = new Generator({
                  path: argv.path as string,
                  generator: 'config',
                  name: 'config',
                  defaults: false,
                });

                await generator.run();
              } catch (error) {
                consoleWriter.error(error);
              }
            },
          });
      },
      handler: async () => {
        parser.showHelp();
        process.exitCode = 1;
      },
    })
    .showHelpOnFail(false)
    .wrap(yargs.terminalWidth())
    .help()
    .version();

  if (argv.length === 0) {
    parser.showHelp();
  } else {
    parser.parse(argv);
  }
}
