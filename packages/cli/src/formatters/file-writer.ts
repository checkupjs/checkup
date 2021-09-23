import { isAbsolute, dirname, resolve, extname } from 'path';
import { Log } from 'sarif';
import { existsSync, mkdirpSync, writeFileSync, writeJsonSync } from 'fs-extra';
import { todayFormat } from '@checkup/core';

const stripAnsi = require('strip-ansi');

export const DEFAULT_OUTPUT_FILENAME = `checkup-report-${todayFormat()}`;

export function writeResultsToFile(
  result: Log | string,
  cwd: string,
  outputFile: string = DEFAULT_OUTPUT_FILENAME
): string {
  let fileType: 'sarif' | 'txt' = typeof result === 'string' ? 'txt' : 'sarif';
  let outputPath = getOutputPath(cwd, outputFile, fileType);

  if (fileType === 'txt') {
    writeFileSync(outputPath, stripAnsi(result));
  } else {
    writeJsonSync(outputPath, result);
  }

  return outputPath;
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
