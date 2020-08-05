import { ReporterArguments } from '../types';
import { ui } from '@checkup/core';
import { dirname, isAbsolute, resolve } from 'path';
import { existsSync, mkdirpSync, writeJsonSync } from 'fs-extra';
import { getActions } from './get-actions';

const date = require('date-and-time');

export const TODAY = date.format(new Date(), 'YYYY-MM-DD-HH_mm_ss');
export const DEFAULT_OUTPUT_FILENAME = `checkup-report-${TODAY}`;

export function report(args: ReporterArguments) {
  let resultJson = {
    info: Object.assign({}, ...args.info.map((result) => result.toJson())),
    results: args.results.map((result) => result.toJson()),
    errors: args.errors,
    actions: getActions(args.results),
  };
  let { outputFile, cwd } = args.flags!;

  if (outputFile) {
    let outputPath = getOutputPath(outputFile, cwd);

    writeJsonSync(outputPath, resultJson);

    ui.log(outputPath);
  } else {
    ui.styledJSON(resultJson);
  }
}

export function getOutputPath(outputFile: string, cwd: string = '') {
  if (/{default}/.test(outputFile)) {
    outputFile = outputFile.replace('{default}', DEFAULT_OUTPUT_FILENAME);
  }

  let outputPath = isAbsolute(outputFile)
    ? outputFile
    : resolve(cwd, outputFile || `${DEFAULT_OUTPUT_FILENAME}.json`);

  let dir = dirname(outputPath);

  if (!existsSync(dir)) {
    mkdirpSync(dir);
  }

  return outputPath;
}
