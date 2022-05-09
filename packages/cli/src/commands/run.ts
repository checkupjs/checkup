import * as yargs from 'yargs';
import * as ora from 'ora';
import { yellow } from 'chalk';
import CheckupTaskRunner from '../api/checkup-task-runner';
import { CLIOptions, consoleWriter } from '../checkup';
import { reportAvailableTasks } from '../formatters/available-tasks';
import { getFormatter } from '../formatters/get-formatter';
import { writeResultsToFile } from '../formatters/file-writer';

export const runCommand = {
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
        description: 'Use the configuration found at this path, overriding .checkuprc if present.',
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
    } catch (error: unknown) {
      spinner.stop();
      consoleWriter.error(error as Error);
    } finally {
      spinner.stop();
    }
  },
};
