import { FormatterOptions } from '@checkup/core';
import { BaseUIFormatter, SummaryFormatter as summary } from '@checkup/ui';

export default class SummaryFormatter extends BaseUIFormatter {
  shouldWrite = true;

  constructor(options: FormatterOptions) {
    super(options, summary);
  }
}
