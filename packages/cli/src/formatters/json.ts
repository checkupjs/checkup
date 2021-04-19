import { Log } from 'sarif';
import { ConsoleWriter } from '@checkup/core';
import { writeSarifFile } from './file-writer';
import { ReportOptions } from './get-formatter';

export default class JsonFormatter {
  options: ReportOptions;
  consoleWriter: ConsoleWriter;

  constructor(options: ReportOptions) {
    this.options = options;
    this.consoleWriter = new ConsoleWriter();
  }

  format(result: Log) {
    if (this.options.outputFile) {
      writeSarifFile(result, this.options.cwd, this.options.outputFile);
    } else {
      this.consoleWriter.styledJSON(result);
    }
  }
}
