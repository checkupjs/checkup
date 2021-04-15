import { CheckupMetadata, ui } from '@checkup/core';
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
    let { cwd } = this.options;
    let { rules } = result.runs[0].tool.driver;
    let metaData = result.properties as CheckupMetadata;

    renderInfo(metaData);

    ui.log('Checkup ran the following task(s) successfully:');
    rules!
      .map((rule) => rule.id)
      .sort()
      .forEach((taskName) => {
        ui.log(success, taskName);
      });

    ui.blankLine();
    ui.log('Results have been saved to the following file:');
    writeOutputFile(result, cwd, this.options.outputFile);

    renderActions(result.properties?.actions);

    ui.blankLine();

    renderCLIInfo(metaData);
  }
}
