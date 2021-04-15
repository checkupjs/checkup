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
  let mergedOptions = Object.assign({}, { format: 'stdout' }, options);

  switch (mergedOptions.format) {
    case OutputFormat.stdout: {
      if (mergedOptions.verbose) {
        return new VerboseFormatter(mergedOptions);
      }
      return new SummaryFormatter(mergedOptions);
    }

    case OutputFormat.json: {
      return new JsonFormatter(mergedOptions);
    }
  }

  throw new CheckupError(ErrorKind.FormatterNotFound, {
    format: mergedOptions.format,
    validFormats: [...Object.values(OutputFormat)],
  });
}
