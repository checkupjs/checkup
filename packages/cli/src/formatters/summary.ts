import { CheckupMetadata, ConsoleWriter } from '@checkup/core';
import { Log } from 'sarif';
import { success } from 'log-symbols';
import { renderActions, renderCLIInfo, renderInfo } from './formatter-utils';
import { writeSarifFile } from './file-writer';
import { ReportOptions } from './get-formatter';

export default class SummaryFormatter {
  options: ReportOptions;
  consoleWriter: ConsoleWriter;

  constructor(options: ReportOptions) {
    this.options = options;
    this.consoleWriter = new ConsoleWriter();
  }

  format(result: Log) {
    let { cwd } = this.options;
    let { rules } = result.runs[0].tool.driver;
    let metaData = result.properties as CheckupMetadata;

    renderInfo(metaData, this.consoleWriter);

    this.consoleWriter.log('Checkup ran the following task(s) successfully:');
    rules!
      .map((rule) => rule.id)
      .sort()
      .forEach((taskName) => {
        this.consoleWriter.log(`${success} ${taskName}`);
      });

    writeSarifFile(result, cwd, this.options.outputFile);

    renderActions(result.properties?.actions, this.consoleWriter);

    this.consoleWriter.blankLine();

    renderCLIInfo(metaData, this.consoleWriter);
  }
}
