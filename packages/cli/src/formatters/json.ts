import { FormatterArgs } from '@checkup/core';
import { writeResultFile } from './file-writer';

export default class JsonFormatter {
  args: FormatterArgs;

  constructor(options: FormatterArgs) {
    this.args = options;
  }

  format() {
    let log = this.args.log;

    if (this.args.outputFile) {
      writeResultFile(log, this.args.cwd, this.args.outputFile);
    } else {
      this.args.writer.styledJSON(log);
    }
  }
}
