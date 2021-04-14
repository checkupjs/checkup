import { Log } from 'sarif';
import { ui } from '@checkup/core';
import { writeOutputFile } from './sarif-file-writer';
import { ReportOptions } from './get-formatter';

export default class JsonFormatter {
  options: ReportOptions;

  constructor(options: ReportOptions) {
    this.options = options;
  }

  format(result: Log) {
    if (this.options.outputFile) {
      writeOutputFile(this.options.outputFile, this.options.cwd, result);
    } else {
      ui.styledJSON(result);
    }
  }
}
