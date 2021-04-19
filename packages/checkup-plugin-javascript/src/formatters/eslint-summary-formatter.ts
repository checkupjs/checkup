import { ConsoleWriter, renderLintingSummaryResult } from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], consoleWriter: ConsoleWriter) {
  renderLintingSummaryResult(taskResults, consoleWriter);
}
