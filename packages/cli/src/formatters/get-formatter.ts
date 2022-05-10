import { createRequire } from 'module';
import { join } from 'path';
import { existsSync } from 'fs';
import {
  OutputFormat,
  ErrorKind,
  CheckupError,
  CheckupLogParser,
  FormatterOptions,
  FormatterCtor,
  normalizePackageName,
} from '@checkup/core';
import { Log } from 'sarif';
import SummaryFormatter from './summary.js';
import JsonFormatter from './json.js';

/**
 * Get formatter from options.format (default: summary)
 *
 * @param  {FormatterOptions} options - formatter options that may specify the formatter name.
 * @param  {string} options.cwd - the directory where custom format located.
 * @param  {OutputFormat | string} options.format - specify the output format, it can be summary, json and customized format
 * @param  {string} options.outputFile - specify a output file to save the result.
 * @return {Formatter} - formatter with a format method that will return the result string.
 */
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

    case OutputFormat.json: {
      Formatter = JsonFormatter;
      break;
    }
    default: {
      try {
        // options.format can either be a valid file system path, a valid formatter package, or a
        // valid short name for a package (a string without the checkup-formatter- prefix)
        let formatterName = existsSync(join(options.cwd, options.format))
          ? options.format
          : normalizePackageName(options.format, 'checkup-formatter');

        const CustomFormatter = createRequire(join(options.cwd, '__placeholder__.js'))(
          formatterName
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
