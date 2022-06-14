import {
  Formatter,
  FormatterOptions,
  CheckupLogParser,
  CheckupError,
  ErrorKind,
} from '@checkup/core';
import * as React from 'react';
import { render } from 'ink-render-string';

export default class BaseUIFormatter implements Formatter {
  shouldWrite = false;
  options: FormatterOptions;
  component: any;

  constructor(options: FormatterOptions, component: any) {
    this.options = options;
    this.component = component;
  }

  format(logParser: CheckupLogParser): string {
    try {
      const result = render(
        React.createElement(this.component, { logParser, options: this.options })
      );

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
