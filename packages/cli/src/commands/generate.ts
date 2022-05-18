import yargs from 'yargs';
import { parser } from '../checkup.js';
import { generatePluginCommand } from './generate/plugin.js';
import { generateTaskCommand } from './generate/task.js';
import { generateActionsCommand } from './generate/actions.js';
import { generateConfigCommand } from './generate/config.js';

export const generateCommand: yargs.CommandModule = {
  command: 'generate',
  aliases: ['g'],
  describe: 'Runs a generator to scaffold Checkup code',
  builder: (yargs: any) => {
    return yargs
      .command(generatePluginCommand)
      .command(generateTaskCommand)
      .command(generateActionsCommand)
      .command(generateConfigCommand);
  },
  handler: async () => {
    parser.showHelp();
    process.exitCode = 1;
  },
};
