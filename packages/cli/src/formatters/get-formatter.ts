import { join } from 'path';
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';
import { createRequire } from 'module';
import resolve from 'resolve';
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
import PrettyFormatter from './pretty.js';
import SonarQubeFormatter from './sonarqube.js';

const require = createRequire(import.meta.url);

/**
 * Get formatter from options.format (default: summary)
 *
 * @param  {FormatterOptions} options - formatter options that may specify the formatter name.
 * @param  {string} options.cwd - the directory where custom format located.
 * @param  {OutputFormat | string} options.format - specify the output format, it can be summary, json and customized format
 * @param  {string} options.outputFile - specify a output file to save the result.
 * @return {Promise<Formatter>} - formatter with a format method that will return the result string.
 */
export async function getFormatter(options: FormatterOptions) {
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

    case OutputFormat.pretty: {
      Formatter = PrettyFormatter;
      break;
    }

    case OutputFormat.sonarqube: {
      Formatter = SonarQubeFormatter;
      break;
    }
    default: {
      try {
        // options.format can either be a valid file system path, a valid formatter package, or a
        // valid short name for a package (a string without the checkup-formatter- prefix)
        let formatterName = existsSync(join(options.cwd, options.format))
          ? options.format
          : normalizePackageName(options.format, 'checkup-formatter');

        let formatterPath = resolve.sync(formatterName, {
          basedir: options.cwd,
          extensions: ['.js', '.mjs', '.cjs'],
        });

        try {
          let formatterUrl = pathToFileURL(formatterPath);

          const { default: CustomFormatter } = await import(formatterUrl.toString());

          Formatter = CustomFormatter;
          break;
        } catch {
          Formatter = require(formatterPath);
        }
      } catch (error) {
        process.stdout.write((<Error>error).toString());
        throw new CheckupError(ErrorKind.FormatterNotFound, {
          format: mergedOptions.format,
          validFormats: [...Object.values(OutputFormat)],
        });
      }
    }
  }

  let formatter = new Formatter(mergedOptions);

  return {
    shouldWrite: formatter.shouldWrite,

    format(log: Log) {
      let logParser = new CheckupLogParser(log);

      return formatter.format(logParser);
    },
  };
}
