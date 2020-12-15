import { Log } from 'sarif';
import { ui, RunFlags } from '@checkup/core';
import { writeOutputFile } from './sarif-file-writer';

export function report(result: Log, flags?: RunFlags) {
  if (flags && flags['output-file']) {
    writeOutputFile(flags['output-file'], flags.cwd, result);
  } else {
    ui.styledJSON(result);
  }
}
