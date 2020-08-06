import { OutputFormat } from '@checkup/core';
import { report as consoleReport } from './console-reporter';
import { report as jsonReport } from './json-reporter';

export function getReporter(outputFormat: OutputFormat) {
  switch (outputFormat) {
    case OutputFormat.stdout: {
      return consoleReport;
    }

    case OutputFormat.json: {
      return jsonReport;
    }
  }
}
