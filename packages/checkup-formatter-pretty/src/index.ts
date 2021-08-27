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
import { getComponents } from './components/index';

class PrettyFormatter implements Formatter {
  options: FormatterOptions;
  component: any;

  constructor(options: FormatterOptions) {
    this.options = options;
    if (this.options.componentName) {
      let componentsMap = getComponents();
      this.component = componentsMap.get(this.options.componentName);
    } else {
      this.component = InkTable;
    }
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
