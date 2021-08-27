import * as React from 'react';
import { render } from 'ink-render-string';
import {
  CheckupLogParser,
  Formatter,
  FormatterOptions,
  ErrorKind,
  CheckupError,
} from '@checkup/core';
import { default as pretty } from './pretty-formatter';

class PrettyFormatter implements Formatter {
  options: FormatterOptions;
  component: any;

  constructor(options: FormatterOptions) {
    this.options = options;
  }

  format(logParser: CheckupLogParser): string {
    try {
      const result = render(React.createElement(pretty, { logParser }));

      if (result.includes('ERROR')) {
        throw result;
      } else {
        return result;
      }
    } catch (error) {
      throw new CheckupError(ErrorKind.InvalidCustomComponent, {
        details: error,
      });
    }
  }
}

export default PrettyFormatter;

export { registerCustomComponent } from './component-provider';
