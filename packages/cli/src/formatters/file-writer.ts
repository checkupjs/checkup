import { isAbsolute, dirname, resolve, extname } from 'path';
import { Log } from 'sarif';
import { existsSync, mkdirpSync, writeFileSync, writeJsonSync } from 'fs-extra';
import { ConsoleWriter, todayFormat } from '@checkup/core';
import { yellow } from 'chalk';

const stripAnsi = require('strip-ansi');

export const DEFAULT_OUTPUT_FILENAME = `checkup-report-${todayFormat()}`;
const consoleWriter = new ConsoleWriter();

export function writeResultFile(
  result: Log | string,
  cwd: string,
  outputFile: string = DEFAULT_OUTPUT_FILENAME
) {
  let fileType: 'sarif' | 'txt' = typeof result === 'string' ? 'txt' : 'sarif';
  let outputPath = getOutputPath(cwd, outputFile, fileType);

  if (fileType === 'txt') {
    writeFileSync(outputPath, stripAnsi(result));
  } else {
    writeJsonSync(outputPath, result);
  }

  consoleWriter.blankLine();
  consoleWriter.log('Results have been saved to the following file:');
  consoleWriter.log(yellow(outputPath));
}

export function getOutputPath(cwd: string = '', outputFile: string, fileType: 'sarif' | 'txt') {
  let outputPath = isAbsolute(outputFile)
    ? outputFile
    : resolve(
        cwd,
        outputFile
          ? // eslint-disable-next-line unicorn/no-nested-ternary
            extname(outputFile)
            ? outputFile
            : `${outputFile}.${fileType}`
          : `${DEFAULT_OUTPUT_FILENAME}.${fileType}`
      );

  let dir = dirname(outputPath);

  if (!existsSync(dir)) {
    mkdirpSync(dir);
  }

  return outputPath;
}
