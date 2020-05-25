import * as Wrap from 'wrap-ansi';

import { CLIError } from '@oclif/errors';
import { red } from 'chalk';

export default class CheckupError extends CLIError {
  constructor(
    error: string | Error,
    public callToAction: string = '',
    options: { code?: string; exit?: number | false } = {}
  ) {
    super(error, options);

    this.name = 'CheckupError';

    // prevent this class from appearing in the stack
    Error.captureStackTrace(this, CheckupError);
  }

  render(): string {
    const wrap: typeof Wrap = require('wrap-ansi');

    let output = `\n${red('Error')}: ${this.message}\n\n${this.callToAction}`;

    output = wrap(output, 80, { trim: false, hard: true });

    return output;
  }
}
