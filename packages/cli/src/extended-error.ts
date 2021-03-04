import { CheckupError } from '@checkup/core';
import { red } from 'chalk';

export function extendedError(
  error: string | Error | CheckupError,
  options: { code?: string; exit?: number | false } = {}
) {
  if (typeof error === 'string') {
    error = new Error(error);
  }

  if (options.exit === false) {
    console.error(
      error instanceof CheckupError ? error.render() : `\n${red('Error')} ${error.message}`
    );
  } else {
    throw error;
  }
}
