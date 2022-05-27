import { BufferedWriter, CheckupLogParser, Formatter, FormatterOptions } from '@checkup/core';
import logSymbols from 'log-symbols';
import chalk from 'chalk';
import { Log } from 'sarif';
import { writeResultsToFile } from './file-writer.js';
import BaseFormatter from './base-formatter.js';

export default class SummaryFormatter extends BaseFormatter<BufferedWriter> implements Formatter {
  shouldWrite = false;

  constructor(options: FormatterOptions) {
    super(options);

    this.writer = new BufferedWriter();
  }

  format(logParser: CheckupLogParser) {
    let { metaData, log, actions, executedTasks } = logParser;

    this.renderMetadata(metaData);
    this.writer.log('Checkup ran the following task(s) successfully:');

    executedTasks
      .map((rule) => rule.id)
      .sort()
      .forEach((taskName) => {
        this.writer.log(`${logSymbols.success} ${taskName}`);
      });

    this.writeResultsToFile(log);
    this.renderActions(actions);
    this.writer.blankLine();
    this.renderCLIInfo(metaData);

    return this.writer.buffer;
  }

  writeResultsToFile(log: Log) {
    let resultsFilePath = writeResultsToFile(log, this.options.cwd, this.options.outputFile);

    this.writer.blankLine();
    this.writer.log('Results have been saved to the following file:');
    this.writer.log(chalk.yellow(resultsFilePath));
  }
}
