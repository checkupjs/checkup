import { CheckupMetadata, RunFlags, ui } from '@checkup/core';
import { Log } from 'sarif';
import { renderActions, renderCLIInfo, renderInfo } from './reporter-utils';
import { writeOutputFile } from './sarif-file-writer';
import { success } from 'log-symbols';

export function report(result: Log, flags?: RunFlags) {
  let { cwd } = flags!;
  let { rules } = result.runs[0].tool.driver;
  let metaData = result.properties as CheckupMetadata;

  renderInfo(metaData);

  ui.log('Checkup ran the following tasks successfully:');
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
