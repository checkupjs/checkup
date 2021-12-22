import { parser } from '../checkup';
import { generatePluginCommand } from './generate/plugin';
import { generateTaskCommand } from './generate/task';
import { generateActionsCommand } from './generate/actions';
import { generateConfigCommand } from './generate/config';

export const generateCommand = {
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
