import { CheckupError } from '@checkup/core';
import { red } from 'chalk';

export function extendedError(error: string | Error | CheckupError) {
  if (typeof error === 'string') {
    error = new Error(error);
  }

  console.error(
    error instanceof CheckupError ? error.render() : `\n${red('Error')} ${error.message}`
  );
}
