import { FormatterOptions } from '@checkup/core';
import { BaseUIFormatter, Pretty } from '@checkup/ui';

export default class PrettyFormatter extends BaseUIFormatter {
  shouldWrite = true;

  constructor(options: FormatterOptions) {
    super(options, Pretty);
  }
}
