import * as yargs from 'yargs';
import Generator from '../../api/generator';
import { consoleWriter } from '../../checkup';

export const generateConfigCommand = {
  command: 'config',
  describe: 'Generates a .checkuprc within a project',
  builder: (yargs: any) => {
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
};
