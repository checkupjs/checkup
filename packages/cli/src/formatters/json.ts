import { ConsoleWriter, Formatter, FormatterArgs } from '@checkup/core';
import { yellow } from 'chalk';
import { writeResultFile } from './file-writer';

export default class JsonFormatter implements Formatter {
  args: FormatterArgs;
  writer: ConsoleWriter;

  constructor(options: FormatterArgs) {
    this.args = options;

    this.writer = new ConsoleWriter();
  }

  format() {
    if (this.args.outputFile) {
      this.writeResultsToFile();
    } else {
      this.writer.styledJSON(this.args.log);
    }
  }

  writeResultsToFile() {
    let resultFilePath = writeResultFile(this.args.log, this.args.cwd, this.args.outputFile);

    this.writer.blankLine();
    this.writer.log('Results have been saved to the following file:');
    this.writer.log(yellow(resultFilePath));
  }
}
