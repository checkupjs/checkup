import { isAbsolute, dirname, resolve } from 'path';
import { Log } from 'sarif';
import { writeJsonSync, existsSync, mkdirpSync } from 'fs-extra';
import { ui, todayFormat } from '@checkup/core';
import { yellow } from 'chalk';

export const DEFAULT_OUTPUT_FILENAME = `checkup-report-${todayFormat()}.sarif`;

export function writeOutputFile(outputFile: string, cwd: string, result: Log) {
  let outputPath = getOutputPath(outputFile, cwd);

  writeJsonSync(outputPath, result);

  ui.log(yellow(outputPath));
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
