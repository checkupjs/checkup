import * as yargs from 'yargs';
import Generator from '../../api/generator';
import { consoleWriter } from '../../checkup';

export const generateTaskCommand = {
  command: 'task <name> [options]',
  describe: 'Generates a checkup task within a project',
  builder: (yargs: any) => {
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
          description: 'The path referring to the directory that the generator will run in',
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
    } catch (error: unknown) {
      consoleWriter.error(error as Error);
    }
  },
};
