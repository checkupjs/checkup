import { OutputFormat, ErrorKind, CheckupError } from '@checkup/core';
import PrettyFormatter from './pretty';
import SummaryFormatter from './summary';
import JsonFormatter from './json';

export interface ReportOptions {
  cwd: string;
  format: OutputFormat;
  outputFile?: string;
}

export function getFormatter(options: ReportOptions) {
  let mergedOptions = Object.assign({}, { format: 'summary' }, options);

  switch (mergedOptions.format) {
    case OutputFormat.summary: {
      return new SummaryFormatter(mergedOptions);
    }

    case OutputFormat.pretty: {
      return new PrettyFormatter(mergedOptions);
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
