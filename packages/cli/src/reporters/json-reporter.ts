import { Log } from 'sarif';
import { ui, RunFlags } from '@checkup/core';
import { writeOutputFile } from './sarif-file-writer';

export function report(result: Log, flags?: RunFlags) {
  let { outputFile, cwd } = flags!;

  if (outputFile) {
    writeOutputFile(outputFile, cwd, result);
  } else {
    ui.styledJSON(result);
  }
}
