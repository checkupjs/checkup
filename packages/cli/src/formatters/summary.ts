import { CheckupMetadata, ConsoleWriter, FormatArgs } from '@checkup/core';
import { Log } from 'sarif';
import { success } from 'log-symbols';
import { renderActions, renderCLIInfo, renderInfo } from './formatter-utils';
import { writeResultFile } from './file-writer';
import { ReportOptions } from './get-formatter';

export default class SummaryFormatter {
  options: ReportOptions;
  consoleWriter: ConsoleWriter;
  formatArgs: FormatArgs;

  constructor(options: ReportOptions) {
    this.options = options;
    this.consoleWriter = new ConsoleWriter();
    this.formatArgs = { writer: this.consoleWriter };
  }

  format(result: Log) {
    let { cwd, outputFile } = this.options;
    let { rules } = result.runs[0].tool.driver;
    let metaData = result.properties as CheckupMetadata;

    renderInfo(metaData, this.formatArgs);

    this.consoleWriter.log('Checkup ran the following task(s) successfully:');
    rules!
      .map((rule) => rule.id)
      .sort()
      .forEach((taskName) => {
        this.consoleWriter.log(`${success} ${taskName}`);
      });

    writeResultFile(result, cwd, outputFile);

    renderActions(result.properties?.actions, this.formatArgs);

    this.consoleWriter.blankLine();

    renderCLIInfo(metaData, this.formatArgs);
  }
}
