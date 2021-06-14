import { FormatterArgs } from '@checkup/core';
import { success } from 'log-symbols';
import { renderActions, renderCLIInfo, renderInfo } from './formatter-utils';
import { writeResultFile } from './file-writer';

export default class SummaryFormatter {
  args: FormatterArgs;

  constructor(args: FormatterArgs) {
    this.args = args;
  }

  format() {
    let log = this.args.log;
    let logParser = this.args.logParser;

    renderInfo(logParser.metaData, this.args);

    this.args.writer.log('Checkup ran the following task(s) successfully:');

    logParser.rules
      .map((rule) => rule.id)
      .sort()
      .forEach((taskName) => {
        this.args.writer.log(`${success} ${taskName}`);
      });

    writeResultFile(log, this.args.cwd, this.args.outputFile);

    renderActions(logParser.actions, this.args);

    this.args.writer.blankLine();

    renderCLIInfo(logParser.metaData, this.args);
  }
}
