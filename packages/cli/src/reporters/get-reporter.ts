import { OutputFormat } from '@checkup/core';
import VerboseConsoleReporter from './verbose-console-reporter';
import ConsoleReporter from './console-reporter';
import JsonReporter from './json-reporter';

export interface ReportOptions {
  cwd: string;
  verbose: boolean;
  format: string;
  outputFile?: string;
}

export function getReporter(options: ReportOptions) {
  if (options.verbose) {
    return new VerboseConsoleReporter(options);
  }

  switch (options.format) {
    case OutputFormat.stdout: {
      return new ConsoleReporter(options);
    }

    case OutputFormat.json: {
      return new JsonReporter(options);
    }
  }

  throw new Error('No reporter found.');
}
