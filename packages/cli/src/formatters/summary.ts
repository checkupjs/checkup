import { CheckupMetadata, ConsoleWriter } from '@checkup/core';
import { Log } from 'sarif';
import { success } from 'log-symbols';
import { renderActions, renderCLIInfo, renderInfo } from './formatter-utils';
import { writeOutputFile } from './sarif-file-writer';
import { ReportOptions } from './get-formatter';

export default class SummaryFormatter {
  options: ReportOptions;

  constructor(options: ReportOptions) {
    this.options = options;
  }

  format(result: Log) {
    let consoleWriter = new ConsoleWriter();
    let { cwd } = this.options;
    let { rules } = result.runs[0].tool.driver;
    let metaData = result.properties as CheckupMetadata;

    renderInfo(metaData);

    consoleWriter.log('Checkup ran the following task(s) successfully:');
    rules!
      .map((rule) => rule.id)
      .sort()
      .forEach((taskName) => {
        consoleWriter.log(`${success} ${taskName}`);
      });

    consoleWriter.blankLine();
    consoleWriter.log('Results have been saved to the following file:');
    writeOutputFile(result, cwd, this.options.outputFile);

    renderActions(result.properties?.actions);

    consoleWriter.blankLine();

    renderCLIInfo(metaData);
  }
}
