import { FormatterOptions } from '@checkup/core';
import { BaseUIFormatter, PrettyFormatter as pretty } from '@checkup/ui';

export default class PrettyFormatter extends BaseUIFormatter {
  shouldWrite = true;

  constructor(options: FormatterOptions) {
    super(options, pretty);
  }
}
