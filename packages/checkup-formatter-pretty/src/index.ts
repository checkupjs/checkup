import { isAbsolute, dirname, resolve, extname } from 'path';
import * as React from 'react';
import { render } from 'ink';
import { Log } from 'sarif';
import { existsSync, mkdirpSync, writeFileSync, writeJsonSync } from 'fs-extra';
import {
  CheckupLogParser,
  Formatter,
  FormatterOptions,
  BufferedWriter,
  BaseOutputWriter,
  ConsoleWriter,
  todayFormat,
} from '@checkup/core';

import { default as pretty } from './pretty-formatter';

const stripAnsi = require('strip-ansi');

const DEFAULT_OUTPUT_FILENAME = `checkup-report-${todayFormat()}`;

const consoleWriter = new ConsoleWriter();

function writeResultFile(
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

function getOutputPath(cwd: string = '', outputFile: string, fileType: 'sarif' | 'txt') {
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

class PrettyFormatter implements Formatter {
  options: FormatterOptions;
  writer: BaseOutputWriter;

  constructor(options: FormatterOptions) {
    this.options = options;
    this.writer = this.options.outputFile ? new BufferedWriter() : new ConsoleWriter();
  }

  format(logParser: CheckupLogParser) {
    render(React.createElement(pretty, { logParser }));

    if (this.options.outputFile) {
      const outputPath = writeResultFile(
        (<BufferedWriter>this.writer).buffer,
        this.options.cwd,
        this.options.outputFile
      );

      consoleWriter.blankLine();
      consoleWriter.log('Results have been saved to the following file:');
      consoleWriter.log(outputPath);
    }
  }
}

export = PrettyFormatter;
