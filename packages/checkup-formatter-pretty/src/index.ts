import * as React from 'react';
import { render } from 'ink-render-string';
import { CheckupLogParser, Formatter } from '@checkup/core';
import { default as pretty } from './pretty-formatter';
import { Options } from './types';

class PrettyFormatter implements Formatter {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  format(logParser: CheckupLogParser): string {
    const result = render(React.createElement(pretty, { logParser }));

    return result;
  }
}

export default PrettyFormatter;
