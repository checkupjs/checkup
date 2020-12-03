import { OutputFormat, RunFlags } from '@checkup/core';
import { report as verboseConsoleReport } from './verbose-console-reporter';
import { report as consoleReport } from './console-reporter';
import { report as jsonReport } from './json-reporter';

export function getReporter(runFlags: RunFlags) {
  if (runFlags.verbose) {
    return verboseConsoleReport;
  }

  switch (runFlags.format) {
    case OutputFormat.stdout: {
      return consoleReport;
    }

    case OutputFormat.json: {
      return jsonReport;
    }
  }

  throw new Error('No reporter found.');
}
