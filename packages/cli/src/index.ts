import { Command, flags } from '@oclif/command';

import Checkup from './checkup';

class CheckupCli extends Command {
  static description = 'A CLI that provides health check information about your project';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' }),
    silent: flags.boolean({ char: 's' }),
    json: flags.boolean(),
    task: flags.string({ char: 't' }),
  };

  async run() {
    let { args, flags } = this.parse(CheckupCli);
    this.log('Checkup run');

    let checkup = new Checkup(args, flags);

    await checkup.run();
  }
}

export = CheckupCli;
