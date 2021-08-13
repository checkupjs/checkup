import { createRequire } from 'module';
import { join } from 'path';
import {
  OutputFormat,
  ErrorKind,
  CheckupError,
  CheckupLogParser,
  FormatterOptions,
  FormatterCtor,
} from '@checkup/core';
import { Log } from 'sarif';
import PrettyFormatter from './pretty';
import SummaryFormatter from './summary';
import JsonFormatter from './json';

export function getFormatter(options: FormatterOptions) {
  let mergedOptions = Object.assign(
    {},
    {
      format: 'summary',
    },
    options
  );
  let Formatter: FormatterCtor;

  switch (mergedOptions.format) {
    case OutputFormat.summary: {
      Formatter = SummaryFormatter;
      break;
    }

    case OutputFormat.pretty: {
      Formatter = PrettyFormatter;
      break;
    }

    case OutputFormat.json: {
      Formatter = JsonFormatter;
      break;
    }
    default: {
      try {
        const CustomFormatter = createRequire(join(options.cwd, '__placeholder__.js'))(
          options.format
        );

        Formatter = CustomFormatter;
        break;
      } catch {
        throw new CheckupError(ErrorKind.FormatterNotFound, {
          format: mergedOptions.format,
          validFormats: [...Object.values(OutputFormat)],
        });
      }
    }
  }

  return {
    format(log: Log) {
      let formatter = new Formatter(mergedOptions);
      let logParser = new CheckupLogParser(log);

      return formatter.format(logParser);
    },
  };
}
