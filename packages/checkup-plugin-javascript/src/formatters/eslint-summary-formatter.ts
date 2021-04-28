import { FormatterArgs, renderLintingSummaryResult } from '@checkup/core';
import { Result } from 'sarif';

export function format(taskResults: Result[], args: FormatterArgs) {
  renderLintingSummaryResult(taskResults, args);
}
