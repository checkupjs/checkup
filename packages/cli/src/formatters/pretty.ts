import { FormatterOptions } from '@checkup/core';
import { BaseUIFormatter } from '@checkup/ui';
import Pretty from './components/Pretty.js';

export default class PrettyFormatter extends BaseUIFormatter {
  shouldWrite = true;

  constructor(options: FormatterOptions) {
    super(options, Pretty);
  }
}
