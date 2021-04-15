import { Log } from 'sarif';
import { ConsoleWriter } from '@checkup/core';
import { writeOutputFile } from './sarif-file-writer';
import { ReportOptions } from './get-formatter';

export default class JsonFormatter {
  options: ReportOptions;

  constructor(options: ReportOptions) {
    this.options = options;
  }

  format(result: Log) {
    let consoleWriter = new ConsoleWriter();

    if (this.options.outputFile) {
      writeOutputFile(result, this.options.cwd, this.options.outputFile);
    } else {
      consoleWriter.styledJSON(result);
    }
  }
}
