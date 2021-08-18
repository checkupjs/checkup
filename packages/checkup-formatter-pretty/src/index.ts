import React from 'react';
import { render } from 'ink';
import { CheckupLogParser, Formatter, FormatterOptions } from '@checkup/core';
import { default as pretty } from './pretty-formatter';

export class PrettyFormatter implements Formatter {
  options: FormatterOptions;

  constructor(options: FormatterOptions) {
    this.options = options;
  }

  format(logParser: CheckupLogParser) {
    render(React.createElement(pretty, logParser));
  }
}
