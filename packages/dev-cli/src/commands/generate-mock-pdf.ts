import { ui } from '@checkup/core';
import { Command, flags } from '@oclif/command';
import { generateReport } from '@checkup/cli';
import { generateMockPDFData } from '../utils/generate-mock-data';

class GenerateMockPdfCommand extends Command {
  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' }),
    silent: flags.boolean({ char: 's' }),
    reportOutputPath: flags.string({
      char: 'o',
      default: '.',
    }),
    config: flags.string({
      char: 'c',
      description: 'Use this configuration, overriding .checkuprc.* if present',
    }),
  };

  async run() {
    let { flags } = this.parse(GenerateMockPdfCommand);

    ui.action.start('Using mock data to generate a checkup report');

    let reportPath = await generateReport(flags.reportOutputPath, generateMockPDFData());
    ui.log(reportPath);

    ui.action.stop();
  }
}

export = GenerateMockPdfCommand;
