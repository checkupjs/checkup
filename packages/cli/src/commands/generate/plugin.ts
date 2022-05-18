import * as yargs from 'yargs';
import Generator from '../../api/generator.js';

export const generatePluginCommand = {
  command: 'plugin <name> [options]',
  describe: 'Generates a checkup plugin project',
  builder: (yargs: any) => {
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
          description: 'The path referring to the directory that the generator will run in',
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
};
