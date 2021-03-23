import { CheckupMetadata, ui } from '@checkup/core';
import { Log } from 'sarif';
import { renderActions, renderCLIInfo, renderInfo } from './reporter-utils';
import { writeOutputFile } from './sarif-file-writer';
import { success } from 'log-symbols';
import { ReportOptions } from './get-reporter';

export default class ConsoleReporter {
  options: ReportOptions;

  constructor(options: ReportOptions) {
    this.options = options;
  }

  report(result: Log) {
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
    writeOutputFile('{default}', cwd, result);

    renderActions(result.properties?.actions);

    ui.blankLine();

    renderCLIInfo(metaData);
  }
}
