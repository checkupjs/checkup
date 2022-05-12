import { isAbsolute, dirname, resolve, extname } from 'path';
import { Log } from 'sarif';
import fs from 'fs-extra';
import { todayFormat } from '@checkup/core';

const { existsSync, mkdirpSync, writeFileSync, writeJsonSync } = fs;
import stripAnsi from 'strip-ansi';

export const DEFAULT_OUTPUT_FILENAME = `checkup-report-${todayFormat()}`;

/**
 * A utility function to write results to an output file. If no `outputFile` is given,
 * it uses a default output file name in the format "checkup-report-YYYY-MM-DD-HH_mm_ss".
 * If result is a string the extension is .txt, otherwise .sarif is used.
 *
 * @param {(Log | string)} result - The result to be output, either a SARIF log or a string.
 * @param {string} cwd - The current working directory to write to.
 * @param {string} [outputFile=DEFAULT_OUTPUT_FILENAME] - The output filename format.
 * @return {*}  {string}
 */
export function writeResultsToFile(
  result: Log | string,
  cwd: string,
  outputFile: string = DEFAULT_OUTPUT_FILENAME
): string {
  let fileType: 'sarif' | 'txt' = typeof result === 'string' ? 'txt' : 'sarif';
  let outputPath = getOutputPath(cwd, outputFile, fileType);

  if (fileType === 'txt') {
    writeFileSync(outputPath, stripAnsi(result.toString()));
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
