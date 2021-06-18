import {
  BufferedWriter,
  ConsoleWriter,
  Formatter,
  FormatterArgs,
  BaseOutputWriter,
} from '@checkup/core';
import { yellow } from 'chalk';
import * as cleanStack from 'clean-stack';
import { startCase } from 'lodash';
import BaseFormatter from './base-formatter';
import { writeResultFile } from './file-writer';

export default class PrettyFormatter extends BaseFormatter<BaseOutputWriter> implements Formatter {
  writer: BaseOutputWriter;

  constructor(args: FormatterArgs) {
    super(args);

    this.writer = this.args.outputFile ? new BufferedWriter() : new ConsoleWriter();
  }

  format() {
    this.renderMetadata();
    this.renderTaskResults();
    this.renderErrors();
    this.renderActions();

    if (process.env.CHECKUP_TIMING === '1') {
      this.renderTimings(this.args.logParser.timings);
    }

    this.renderCLIInfo();

    if (this.args.outputFile) {
      this.writeResultsToFile();
    }
  }

  renderTaskResults(): void {
    let currentCategory = '';

    if (this.args.logParser.hasResults) {
      let resultsByRule = this.args.logParser.resultsByRule;

      resultsByRule.forEach(({ rule }) => {
        let category = rule.properties?.category;

        if (category !== currentCategory) {
          this.writer.categoryHeader(startCase(category));
          currentCategory = category;
        }

        this.writer.log(rule.id);
      });
    }
    this.writer.blankLine();
  }

  renderErrors() {
    let notifications = this.args.logParser.exceptions;

    if (notifications && notifications.length > 0) {
      this.writer.table(
        notifications.map((notification) => {
          return [
            notification.associatedRule?.id as string,
            cleanStack(notification.exception?.stack?.frames.join('\n') || ''),
          ];
        }),
        ['Task Name', 'Error']
      );
    }
  }

  renderTimings(timings: Record<string, number>) {
    let total = Object.values(timings).reduce((total, timing) => (total += timing), 0);

    this.writer.categoryHeader('Task Timings');

    this.writer.table(
      Object.keys(timings)
        .map((taskName) => [
          taskName,
          Number.parseFloat(timings[taskName].toFixed(2)),
          `${((timings[taskName] * 100) / total).toFixed(1)}%`,
        ])
        .sort((a, b) => (b[1] as number) - (a[1] as number)),
      ['Task Name', 'Time (sec)', 'Relative']
    );

    this.writer.blankLine();
  }

  writeResultsToFile() {
    let resultsFilePath = writeResultFile(
      (<BufferedWriter>this.writer).buffer,
      this.args.cwd,
      this.args.outputFile
    );

    this.writer.blankLine();
    this.writer.log('Results have been saved to the following file:');
    this.writer.log(yellow(resultsFilePath));
  }
}
