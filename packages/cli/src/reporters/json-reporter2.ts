import { Log } from 'sarif';
import { ui } from '@checkup/core';
import { writeOutputFile } from './sarif-file-writer';
import { ReportOptions } from './get-reporter2';

export default class JsonReporter {
  options: ReportOptions;

  constructor(options: ReportOptions) {
    this.options = options;
  }

  report(result: Log) {
    if (this.options.outputFile) {
      writeOutputFile(this.options.outputFile, this.options.cwd, result);
    } else {
      ui.styledJSON(result);
    }
  }
}
