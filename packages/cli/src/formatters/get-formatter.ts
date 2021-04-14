import { OutputFormat, ErrorKind, CheckupError } from '@checkup/core';
import VerboseFormatter from './verbose';
import SummaryFormatter from './summary';
import JsonFormatter from './json';

export interface ReportOptions {
  cwd: string;
  verbose: boolean;
  format: string;
  outputFile?: string;
}

export function getFormatter(options: ReportOptions) {
  if (options.verbose) {
    return new VerboseFormatter(options);
  }

  switch (options.format) {
    case OutputFormat.stdout: {
      return new SummaryFormatter(options);
    }

    case OutputFormat.json: {
      return new JsonFormatter(options);
    }
  }

  throw new CheckupError(ErrorKind.FormatterNotFound, {
    format: options.format,
    validFormats: [...Object.values(OutputFormat)],
  });
}
