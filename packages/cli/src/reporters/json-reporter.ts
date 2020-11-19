import { ui, RunFlags } from '@checkup/core';
import { dirname, isAbsolute, resolve } from 'path';
import { existsSync, mkdirpSync, writeJsonSync } from 'fs-extra';
import { Log } from 'sarif';

const date = require('date-and-time');

export const TODAY = date.format(new Date(), 'YYYY-MM-DD-HH_mm_ss');
export const DEFAULT_OUTPUT_FILENAME = `checkup-report-${TODAY}`;

export function report(result: Log, flags?: RunFlags) {
  let { outputFile, cwd } = flags!;

  if (outputFile) {
    let outputPath = getOutputPath(outputFile, cwd);

    writeJsonSync(outputPath, result);

    ui.log(outputPath);
  } else {
    ui.styledJSON(result);
  }
}

export function getOutputPath(outputFile: string, cwd: string = '') {
  if (/{default}/.test(outputFile)) {
    outputFile = outputFile.replace('{default}', DEFAULT_OUTPUT_FILENAME);
  }

  let outputPath = isAbsolute(outputFile)
    ? outputFile
    : resolve(cwd, outputFile || `${DEFAULT_OUTPUT_FILENAME}.sarif`);

  let dir = dirname(outputPath);

  if (!existsSync(dir)) {
    mkdirpSync(dir);
  }

  return outputPath;
}
