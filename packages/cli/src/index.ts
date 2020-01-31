import { Command, flags } from '@oclif/command';

class CheckupCli extends Command {
  static description = 'A CLI that provides health check information about your project';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' }),
  };

  async run() {
    this.parse(CheckupCli);
    this.log('Checkup run');
  }
}

export = CheckupCli;
