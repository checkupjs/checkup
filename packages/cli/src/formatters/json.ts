import { CheckupLogParser, ConsoleWriter, Formatter, FormatterOptions } from '@checkup/core';
import { yellow } from 'chalk';
import { Log } from 'sarif';
import { writeResultFile } from './file-writer';

export default class JsonFormatter implements Formatter {
  options: FormatterOptions;
  writer: ConsoleWriter;

  constructor(options: FormatterOptions) {
    this.options = options;

    this.writer = new ConsoleWriter();
  }

  format(logParser: CheckupLogParser) {
    let log = logParser.log;

    if (this.options.outputFile) {
      this.writeResultsToFile(log);
    } else {
      this.writer.styledJSON(log);
    }
  }

  writeResultsToFile(log: Log) {
    let resultFilePath = writeResultFile(log, this.options.cwd, this.options.outputFile);

    this.writer.blankLine();
    this.writer.log('Results have been saved to the following file:');
    this.writer.log(yellow(resultFilePath));
  }
}
