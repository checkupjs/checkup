import * as yargs from 'yargs';
import * as ora from 'ora';
import { yellow } from 'chalk';
import { OutputFormat, ConsoleWriter, CheckupConfig } from '@checkup/core';
import CheckupTaskRunner from './api/checkup-task-runner';
import Generator from './api/generator';
import { getFormatter } from './formatters/get-formatter';
import { reportAvailableTasks } from './formatters/available-tasks';
import { writeResultsToFile } from './formatters/file-writer';

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

type CLIOptions = CheckupArguments & yargs.Arguments;

export async function run(argv: string[] = process.argv.slice(2)) {
  let consoleWriter = new ConsoleWriter();
  let parser = yargs
    .scriptName('checkup')
    .usage(
      `
A health checkup for your project ✅

checkup <command> [options]`
    )
    .command({
      command: 'run',
      aliases: ['r'],
      describe: 'Runs configured checkup tasks',
      builder: (yargs: any) => {
        return yargs.usage('checkup run [paths..] [options]').options({
          'exclude-paths': {
            alias: 'e',
            description:
              'Paths to exclude from checkup. If paths are provided via command line and via checkup config, command line paths will be used.',
            multiple: true,
            array: true,
          },

          'config-path': {
            alias: 'c',
            description:
              'Use the configuration found at this path, overriding .checkuprc if present.',
            default: '.checkuprc',
          },

          config: {
            description: 'Use this configuration, overriding .checkuprc if present.',
          },

          cwd: {
            alias: 'd',
            description: 'The path referring to the root directory that Checkup will run in',
            default: () => process.cwd(),
          },

          category: {
            description: 'Runs specific tasks specified by category. Can be used multiple times.',
            exclusive: ['group', 'task'],
            multiple: true,
            array: true,
          },

          group: {
            description: 'Runs specific tasks specified by group. Can be used multiple times.',
            exclusive: ['category', 'task'],
            multiple: true,
            array: true,
          },

          task: {
            alias: 't',
            description:
              'Runs specific tasks specified by the fully qualified task name in the format pluginName/taskName. Can be used multiple times.',
            exclusive: ['category', 'group'],
            multiple: true,
            array: true,
          },

          format: {
            alias: 'f',
            default: 'summary',
            description: 'Use a specific output format',
          },

          'output-file': {
            alias: 'o',
            default: '',
            description: 'Specify file to write JSON output to.',
          },

          'list-tasks': {
            alias: 'l',
            description: 'List all available tasks to run.',
            boolean: true,
          },

          'plugin-base-dir': {
            alias: 'p',
            description:
              'The base directory where Checkup will load the plugins from. Defaults to cwd.',
          },
        });
      },
      handler: async (options: CLIOptions) => {
        let paths = options._.slice(1) as string[];

        let taskRunner = new CheckupTaskRunner({
          paths,
          excludePaths: options.excludePaths,
          config: options.config,
          configPath: options.configPath,
          cwd: options.cwd,
          categories: options.category,
          groups: options.group,
          tasks: options.task,
          pluginBaseDir: options['plugin-base-dir'] as string,
        });

        if (!paths || paths.length === 0) {
          if (options.listTasks) {
            let availableTasks = await taskRunner.getAvailableTasks();

            reportAvailableTasks(availableTasks);
          } else {
            yargs.showHelp();
            process.exitCode = 1;
          }

          return;
        }

        let spinner = ora().start('Checking up on your project');

        try {
          let log = await taskRunner.run();

          let formatter = getFormatter({
            cwd: options.cwd,
            format: options.format,
            outputFile: options.outputFile,
          });

          spinner.stop();
          let output = formatter.format(log);

          if (output) {
            if (options.outputFile) {
              let resultFilePath = writeResultsToFile(log, options.cwd, options.outputFile);

              console.log();
              console.log('Results have been saved to the following file:');
              console.log(yellow(resultFilePath));
            } else {
              console.log(output);
            }
          }
        } catch (error) {
          spinner.stop();
          consoleWriter.error(error);
        } finally {
          spinner.stop();
        }
      },
    })
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
