import { CheckupMetadata, FormatterArgs } from '@checkup/core';
import { Log } from 'sarif';
import { success } from 'log-symbols';
import { renderActions, renderCLIInfo, renderInfo } from './formatter-utils';
import { writeResultFile } from './file-writer';

export default class SummaryFormatter {
  args: FormatterArgs;

  constructor(args: FormatterArgs) {
    this.args = args;
  }

  format(result: Log) {
    let { rules } = result.runs[0].tool.driver;
    let metaData = result.properties as CheckupMetadata;

    renderInfo(metaData, this.args);

    this.args.writer.log('Checkup ran the following task(s) successfully:');

    rules!
      .map((rule) => rule.id)
      .sort()
      .forEach((taskName) => {
        this.args.writer.log(`${success} ${taskName}`);
      });

    writeResultFile(result, this.args.cwd, this.args.outputFile);

    renderActions(result.properties?.actions, this.args);

    this.args.writer.blankLine();

    renderCLIInfo(metaData, this.args);
  }
}
