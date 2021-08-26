import * as React from 'react';
import { render } from 'ink-render-string';
import { CheckupLogParser, Formatter, FormatterOptions } from '@checkup/core';
import { default as pretty } from './pretty-formatter';

class PrettyFormatter implements Formatter {
  options: FormatterOptions;

  constructor(options: FormatterOptions) {
    this.options = options;
  }

  format(logParser: CheckupLogParser): string {
    return render(React.createElement(pretty, { logParser }));
  }
}

export default PrettyFormatter;
