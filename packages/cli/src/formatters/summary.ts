import { ConsoleWriter, Formatter, FormatterArgs } from '@checkup/core';
import { success } from 'log-symbols';
import { yellow } from 'chalk';
import { writeResultFile } from './file-writer';
import BaseFormatter from './base-formatter';

export default class SummaryFormatter extends BaseFormatter<ConsoleWriter> implements Formatter {
  constructor(args: FormatterArgs) {
    super(args);

    this.writer = new ConsoleWriter();
  }

  format() {
    let { rules } = this.args.logParser;

    this.renderMetadata();
    this.writer.log('Checkup ran the following task(s) successfully:');

    rules
      .map((rule) => rule.id)
      .sort()
      .forEach((taskName) => {
        this.writer.log(`${success} ${taskName}`);
      });

    this.writeResultsToFile();
    this.renderActions();
    this.writer.blankLine();
    this.renderCLIInfo();
  }

  writeResultsToFile() {
    let resultsFilePath = writeResultFile(
      this.args.logParser.log,
      this.args.cwd,
      this.args.outputFile
    );

    this.writer.blankLine();
    this.writer.log('Results have been saved to the following file:');
    this.writer.log(yellow(resultsFilePath));
  }
}
