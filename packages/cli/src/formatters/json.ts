import { CheckupLogParser, ConsoleWriter, Formatter, FormatterOptions } from '@checkup/core';
import chalk from 'chalk';
import { Log } from 'sarif';
import { writeResultsToFile } from './file-writer.js';

export default class JsonFormatter implements Formatter {
  shouldWrite = true;
  options: FormatterOptions;
  writer: ConsoleWriter;

  constructor(options: FormatterOptions) {
    this.options = options;

    this.writer = new ConsoleWriter();
  }

  format(logParser: CheckupLogParser) {
    return JSON.stringify(logParser.log, null, 2);
  }

  writeResultsToFile(log: Log) {
    let resultFilePath = writeResultsToFile(log, this.options.cwd, this.options.outputFile);

    this.writer.blankLine();
    this.writer.log('Results have been saved to the following file:');
    this.writer.log(chalk.yellow(resultFilePath));
  }
}
