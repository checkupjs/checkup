import { FormatArgs, renderLintingSummaryResult } from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], formatArgs: FormatArgs) {
  renderLintingSummaryResult(taskResults, formatArgs);
}
