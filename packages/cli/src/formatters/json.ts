import { Log } from 'sarif';
import { FormatterArgs } from '@checkup/core';
import { writeResultFile } from './file-writer';

export default class JsonFormatter {
  args: FormatterArgs;

  constructor(options: FormatterArgs) {
    this.args = options;
  }

  format(result: Log) {
    if (this.args.outputFile) {
      writeResultFile(result, this.args.cwd, this.args.outputFile);
    } else {
      this.args.writer.styledJSON(result);
    }
  }
}
