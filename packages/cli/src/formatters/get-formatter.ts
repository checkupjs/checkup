import { createRequire } from 'module';
import { join } from 'path';
import {
  OutputFormat,
  ErrorKind,
  CheckupError,
  CheckupLogParser,
  FormatterOptions,
} from '@checkup/core';
import PrettyFormatter from './pretty2';
import SummaryFormatter from './summary';
import JsonFormatter from './json';

export function getFormatter(options: FormatterOptions) {
  let mergedOptions = Object.assign(
    {},
    {
      format: 'summary',
      logParser: new CheckupLogParser(options.log),
    },
    options
  );

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
    default: {
      try {
        const CustomFormatter = createRequire(join(options.cwd, '__placeholder__.js'))(
          options.format
        );

        return new CustomFormatter(mergedOptions);
      } catch {
        throw new CheckupError(ErrorKind.FormatterNotFound, {
          format: mergedOptions.format,
          validFormats: [...Object.values(OutputFormat)],
        });
      }
    }
  }
}
