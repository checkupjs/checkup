import * as React from 'react';
import { render } from 'ink-render-string';
import {
  CheckupLogParser,
  Formatter,
  FormatterOptions,
  ErrorKind,
  CheckupError,
} from '@checkup/core';
import { default as InkTable } from 'ink-table';
import { default as pretty } from './pretty-formatter';
import { registeredComponents } from './component-provider';

class PrettyFormatter implements Formatter {
  options: FormatterOptions;
  component: any;

  constructor(options: FormatterOptions) {
    this.options = options;
    this.component = this.options.componentName
      ? registeredComponents.get(this.options.componentName)
      : InkTable;
  }

  format(logParser: CheckupLogParser, component: any = this.component): string {
    try {
      const result = render(React.createElement(pretty, { logParser, component }));

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
