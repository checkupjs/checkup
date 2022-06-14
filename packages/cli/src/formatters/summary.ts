import { FormatterOptions } from '@checkup/core';
import { BaseUIFormatter } from '@checkup/ui';
import Summary from './components/Summary.js';

export default class SummaryFormatter extends BaseUIFormatter {
  shouldWrite = true;

  constructor(options: FormatterOptions) {
    super(options, Summary);
  }
}
