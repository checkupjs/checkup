import { CheckupLogParser, Formatter, FormatterOptions } from '@checkup/core';

export default class JsonFormatter implements Formatter {
  shouldWrite = true;
  options: FormatterOptions;

  constructor(options: FormatterOptions) {
    this.options = options;
  }

  format(logParser: CheckupLogParser) {
    return JSON.stringify(logParser.log, null, 2);
  }
}
