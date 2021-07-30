import { CheckupLogParser, OutputFormat, FormatterOptions } from '@checkup/core';

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
  }
}
