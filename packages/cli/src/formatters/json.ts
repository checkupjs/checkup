import { ConsoleWriter, Formatter, FormatterArgs } from '@checkup/core';
import { writeResultFile } from './file-writer';

export default class JsonFormatter implements Formatter {
  args: FormatterArgs;
  writer: ConsoleWriter;

  constructor(options: FormatterArgs) {
    this.args = options;

    this.writer = new ConsoleWriter();
  }

  format() {
    let log = this.args.log;

    if (this.args.outputFile) {
      writeResultFile(log, this.args.cwd, this.args.outputFile);
    } else {
      this.writer.styledJSON(log);
    }
  }
}
